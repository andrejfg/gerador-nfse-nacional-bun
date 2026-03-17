/**
 * Gerenciamento de certificado digital A1 (.pfx / .p12)
 * Migrado de nfse-php/src/Signer/Certificate.php
 *
 * Usa node-forge para leitura do PFX sem dependências nativas de OpenSSL
 */

import forge from 'node-forge'
import { readFileSync } from 'node:fs'

export interface CertificateInfo {
  privateKeyPem: string
  certificatePem: string
  certificateClean: string
  expiresAt: Date
  commonName: string
  pfxBuffer: Buffer
  password: string
}

export function loadCertificate(pfxPathOrBuffer: string | Buffer, password: string): CertificateInfo {
  const pfxBuffer =
    typeof pfxPathOrBuffer === 'string'
      ? readFileSync(pfxPathOrBuffer)
      : pfxPathOrBuffer

  const pfxDer = forge.util.createBuffer(pfxBuffer.toString('binary'))
  const pfxAsn1 = forge.asn1.fromDer(pfxDer)

  let pkcs12: forge.pkcs12.Pkcs12Pfx
  try {
    pkcs12 = forge.pkcs12.pkcs12FromAsn1(pfxAsn1, password)
  } catch (err) {
    throw new Error(`Falha ao abrir o certificado. Verifique a senha. Detalhe: ${(err as Error).message}`)
  }

  const KEY_OID = forge.pki.oids.pkcs8ShroudedKeyBag as string
  const keyBags = pkcs12.getBags({ bagType: KEY_OID })
  const keyBag = keyBags[KEY_OID]?.[0]
  if (!keyBag?.key) throw new Error('Chave privada não encontrada no certificado')

  const privateKeyPem = forge.pki.privateKeyToPem(keyBag.key)

  const CERT_OID = forge.pki.oids.certBag as string
  const certBags = pkcs12.getBags({ bagType: CERT_OID })
  const certBag = certBags[CERT_OID]?.[0]
  if (!certBag?.cert) throw new Error('Certificado público não encontrado no PFX')

  const cert = certBag.cert
  const certificatePem = forge.pki.certificateToPem(cert)
  const certificateClean = certificatePem
    .replace('-----BEGIN CERTIFICATE-----', '')
    .replace('-----END CERTIFICATE-----', '')
    .replace(/\r?\n/g, '')
    .trim()

  const expiresAt = cert.validity.notAfter
  if (expiresAt < new Date()) {
    throw new Error(`Certificado expirado em ${expiresAt.toISOString()}`)
  }

  const cn = cert.subject.getField('CN')
  const commonName = cn?.value ?? 'Desconhecido'

  return { privateKeyPem, certificatePem, certificateClean, expiresAt, commonName, pfxBuffer, password }
}

export function signWithKey(content: string, privateKeyPem: string, algorithm: 'SHA1' | 'SHA256' = 'SHA256'): Buffer {
  const privateKey = forge.pki.privateKeyFromPem(privateKeyPem)
  const md = algorithm === 'SHA256' ? forge.md.sha256.create() : forge.md.sha1.create()
  md.update(content, 'utf8')
  const signature = privateKey.sign(md)
  return Buffer.from(signature, 'binary')
}
