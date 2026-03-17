/**
 * Assinador de XML com XMLDSig (RSA-SHA256)
 * Migrado de nfse-php/src/Signer/XmlSigner.php
 */

import { SignedXml } from 'xml-crypto'
import type { CertificateInfo } from './certificate.js'

export type SignatureAlgorithm = 'SHA1' | 'SHA256'

/**
 * Assina um XML com XMLDSig enveloped (RSA-SHA256 por padrão).
 *
 * @throws {Error} Se o conteúdo XML for vazio.
 * @throws {Error} Se a tag a assinar não for encontrada no XML.
 * @throws {Error} Se a tag encontrada não possuir o atributo `Id` (ou estiver vazio).
 */
export function signXml(
  xml: string,
  tagName: string,
  cert: CertificateInfo,
  algorithm: SignatureAlgorithm = 'SHA256'
): string {
  // Guards — portado de nfse-php/src/Signer/XmlSigner.php
  if (!xml || xml.trim() === '') {
    throw new Error('Conteúdo XML vazio.')
  }

  const tagRegex = new RegExp(`<[^/][^>]*${tagName}`)
  if (!tagRegex.test(xml)) {
    throw new Error(`Tag ${tagName} não encontrada para assinatura.`)
  }

  const idRegex = new RegExp(`<[^>]*${tagName}[^>]*\\sId="([^"]*)"`)
  const idMatch = idRegex.exec(xml)
  if (!idMatch || idMatch[1] === '') {
    throw new Error(`Tag a ser assinada deve possuir um atributo 'Id'.`)
  }

  const sigAlgorithm = algorithm === 'SHA256'
    ? 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256'
    : 'http://www.w3.org/2000/09/xmldsig#rsa-sha1'

  const digestAlgorithm = algorithm === 'SHA256'
    ? 'http://www.w3.org/2001/04/xmlenc#sha256'
    : 'http://www.w3.org/2000/09/xmldsig#sha1'

  const sig = new SignedXml({
    privateKey: cert.privateKeyPem,
    publicCert: cert.certificatePem,
    signatureAlgorithm: sigAlgorithm,
    canonicalizationAlgorithm: 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315',
  })

  sig.addReference({
    xpath: `//*[local-name(.)='${tagName}']`,
    digestAlgorithm,
    transforms: [
      'http://www.w3.org/2000/09/xmldsig#enveloped-signature',
      'http://www.w3.org/TR/2001/REC-xml-c14n-20010315',
    ],
  })

  sig.computeSignature(xml, {
    location: {
      reference: `//*[local-name(.)='${tagName}']`,
      action: 'after',
    },
  })

  let signedXml = sig.getSignedXml()
  return injectCertificate(signedXml, cert.certificateClean)
}

function injectCertificate(signedXml: string, certificateClean: string): string {
  const keyInfoBlock = `<KeyInfo><X509Data><X509Certificate>${certificateClean}</X509Certificate></X509Data></KeyInfo>`
  if (signedXml.includes('<KeyInfo>')) {
    return signedXml.replace(/<KeyInfo>[\s\S]*?<\/KeyInfo>/, keyInfoBlock)
  }
  return signedXml.replace('</Signature>', `${keyInfoBlock}</Signature>`)
}

/**
 * Comprime XML para GZip+Base64 (formato exigido pela SEFIN Nacional)
 */
export async function compressXml(xml: string): Promise<string> {
  const data = new TextEncoder().encode(xml)
  const cs = new CompressionStream('gzip')
  const writer = cs.writable.getWriter()
  writer.write(data)
  writer.close()

  const chunks: Uint8Array[] = []
  const reader = cs.readable.getReader()
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
  }

  const total = chunks.reduce((acc, c) => acc + c.length, 0)
  const out = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) { out.set(chunk, offset); offset += chunk.length }
  return Buffer.from(out).toString('base64')
}

/**
 * Descomprime Base64+GZip recebido da SEFIN
 */
export async function decompressXml(base64: string): Promise<string> {
  const compressed = Buffer.from(base64, 'base64')
  const ds = new DecompressionStream('gzip')
  const writer = ds.writable.getWriter()
  writer.write(compressed)
  writer.close()

  const chunks: Uint8Array[] = []
  const reader = ds.readable.getReader()
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
  }

  const total = chunks.reduce((acc, c) => acc + c.length, 0)
  const out = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) { out.set(chunk, offset); offset += chunk.length }
  return new TextDecoder().decode(out)
}
