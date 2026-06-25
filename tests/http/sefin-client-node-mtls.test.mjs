/**
 * Valida mTLS do SefinClient em Node.js (tsx, Lambda, etc.).
 * Não roda na suíte Bun — execute: node tests/http/sefin-client-node-mtls.test.mjs
 * (após `bun run build`).
 */
import assert from 'node:assert/strict'
import https from 'node:https'
import forge from 'node-forge'
import { SefinClient, TipoAmbiente } from '../../dist/index.js'

// Carregado também pela suíte `bun test`, mas só roda sob Node.js — o objetivo
// é o ramo https.request, não o stack fetch+tls do Bun. Sob Bun, vira no-op.
const IS_BUN = Boolean(process.versions.bun)

function createCa() {
  const keys = forge.pki.rsa.generateKeyPair(2048)
  const cert = forge.pki.createCertificate()
  cert.publicKey = keys.publicKey
  cert.serialNumber = `00${forge.util.bytesToHex(forge.random.getBytesSync(8))}`
  cert.validity.notBefore = new Date()
  cert.validity.notAfter = new Date()
  cert.validity.notAfter.setFullYear(cert.validity.notAfter.getFullYear() + 2)
  cert.setSubject([
    { name: 'commonName', value: 'Mtls Test CA' },
    { shortName: 'C', value: 'BR' },
  ])
  cert.setIssuer(cert.subject.attributes)
  cert.setExtensions([
    { name: 'basicConstraints', cA: true },
    {
      name: 'keyUsage',
      keyCertSign: true,
      digitalSignature: true,
    },
  ])
  cert.sign(keys.privateKey, forge.md.sha256.create())
  return { keys, cert }
}

function createSignedEndEntity(ca, cn, keys, { serverAuth, clientAuth }) {
  const cert = forge.pki.createCertificate()
  cert.publicKey = keys.publicKey
  cert.serialNumber = `00${forge.util.bytesToHex(forge.random.getBytesSync(8))}`
  cert.validity.notBefore = new Date()
  cert.validity.notAfter = new Date()
  cert.validity.notAfter.setFullYear(cert.validity.notAfter.getFullYear() + 1)
  cert.setSubject([{ name: 'commonName', value: cn }])
  cert.setIssuer(ca.cert.subject.attributes)
  const ext = [
    { name: 'basicConstraints', cA: false },
    {
      name: 'keyUsage',
      digitalSignature: true,
      keyEncipherment: true,
    },
  ]
  if (serverAuth || clientAuth) {
    ext.push({
      name: 'extKeyUsage',
      ...(serverAuth ? { serverAuth: true } : {}),
      ...(clientAuth ? { clientAuth: true } : {}),
    })
  }
  ext.push({
    name: 'subjectAltName',
    altNames: [
      { type: 2, value: 'localhost' },
      { type: 7, ip: '127.0.0.1' },
    ],
  })
  cert.setExtensions(ext)
  cert.sign(ca.keys.privateKey, forge.md.sha256.create())
  return cert
}

function buildClientPfx(ca, clientKeys, clientCert, password) {
  const p12Asn1 = forge.pkcs12.toPkcs12Asn1(
    clientKeys.privateKey,
    [clientCert, ca.cert],
    password,
    {
      algorithm: '3des',
      friendlyName: 'mtls-test-client',
    },
  )
  const der = forge.asn1.toDer(p12Asn1).getBytes()
  return Buffer.from(der, 'binary')
}

function startMtlsServer({ key, cert, ca }) {
  return new Promise((resolve, reject) => {
    const server = https.createServer(
      {
        key,
        cert,
        ca: [ca],
        requestCert: true,
        rejectUnauthorized: true,
      },
      (req, res) => {
        if (req.method === 'HEAD' && req.url?.startsWith('/dps/')) {
          res.writeHead(200)
          res.end()
          return
        }
        res.writeHead(404)
        res.end()
      },
    )
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address()
      const port = typeof addr === 'object' && addr?.port
      assert.ok(port, 'porta alocada')
      resolve({ server, port })
    })
  })
}

async function main() {
  const ca = createCa()
  const serverKeys = forge.pki.rsa.generateKeyPair(2048)
  const serverCert = createSignedEndEntity(ca, 'localhost', serverKeys, {
    serverAuth: true,
    clientAuth: false,
  })
  const clientKeys = forge.pki.rsa.generateKeyPair(2048)
  const clientCert = createSignedEndEntity(ca, 'mtls-test-client', clientKeys, {
    serverAuth: false,
    clientAuth: true,
  })

  const password = 'node-mtls-test'
  const pfx = buildClientPfx(ca, clientKeys, clientCert, password)

  const { server, port } = await startMtlsServer({
    key: forge.pki.privateKeyToPem(serverKeys.privateKey),
    cert: forge.pki.certificateToPem(serverCert),
    ca: forge.pki.certificateToPem(ca.cert),
  })

  try {
    const client = new SefinClient({
      ambiente: TipoAmbiente.Homologacao,
      endpoint: {
        homologacao: `https://127.0.0.1:${port}`,
        producao: 'https://127.0.0.1:1',
      },
      certificateData: pfx,
      certificatePassword: password,
    })

    const ok = await client.verificarDps('42')
    assert.equal(ok, true, 'HEAD /dps/42 com certificado de cliente deve retornar 200')
  } finally {
    server.close()
  }

  console.log('sefin-client-node-mtls: ok')
}

if (IS_BUN) {
  console.log('sefin-client-node-mtls: pulado sob Bun — rode com `node tests/http/sefin-client-node-mtls.test.mjs` após `bun run build`.')
} else {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
