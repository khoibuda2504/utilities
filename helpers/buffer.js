export function _arrayBufferToBase64(arrayBuffer) {
  return window.btoa(
    new Uint8Array(arrayBuffer)
      .reduce((data, byte) => data + String.fromCharCode(byte), '')
  )
}