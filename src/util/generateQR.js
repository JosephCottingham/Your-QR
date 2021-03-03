const Code = require('../models/code')
var QRCode = require('qrcode')

module.exports = field => {
    return function generateQR(code) {
        QRCode.toFile(
            'example.png',
            code.data,
            {
                errorCorrectionLevel: code.error_correction_level,
                color: {
                dark: code.dark_color,
                light: code.light_color,
                },
                width: code.image_width,
            }, function (err, url) {
                console.log(url)
            })
        }
}