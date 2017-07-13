const multer  = require('multer')
import * as fs from 'fs'
const mmm = require('mmmagic')


import { config } from '../global'
import { FileStorage } from  '../lib/fileStorage'


const Magic = mmm.Magic
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, config.root + '/../.temp/uploads')
    },
    filename: (req, file, callback) => {
        callback(null, file.fieldname + '-' + Date.now())
    }
})

const multerOptions = {
    limits: {
        fileSize: config.maxUploadSize
    },
    storage : storage
}


const upload: any = multer(multerOptions).single('file')
const gridStorage = new FileStorage()


module.exports = (req, res, next) => {
    // this function check the content of a file
    // to see if a file type is is allowed
    // the allowed types should be put to req.uploadAllowedTypes = [];  (string array)
    // using middleware before this middleware
    function checkFileType(filePath: string): Promise<boolean> {
        return new Promise(resolve => {
            if (typeof req.uploadAllowedTypes === 'undefined') {
                resolve(true)
                return
            }

            const magic = new Magic(mmm.MAGIC_MIME_TYPE)
            magic.detectFile(filePath, function(err, fileType) {
                if (err) return false

                if (req.uploadAllowedTypes.indexOf(fileType) === -1) {
                    // file type not allowed
                    resolve(false)
                }
            })

            resolve(true)
        })
    }





    upload(req, res, async (err) => {
        if (err) {
            req._upload = {
                error: 1,
                msg: err
            }

            next()
            return
        }


        req._upload = {
            error: 0,
            file: null
        }

        let privateFile = req.headers['private-file'] === 'true'


        let file = req.file
        let data = {
            id: null,
            path: file.path,
            name: file.originalname,
            metadata: {
                privateFile,
                size: file.size,
                encoding: file.encoding,
                mimetype: file.mimetype,
                userID: null,
                type: req.imageType
            }
        }



        if (
            typeof req.appUser !== 'undefined' &&
            typeof req.appUser.id !== 'undefined'
        ) {
            data.metadata.userID = req.appUser.id
        }

        const fileTypeOK = await checkFileType(file.path)

        if (!fileTypeOK) {
            return
        }

        const result = await gridStorage.writeFile(data)

        if (result.error) {
            req._upload.file = {
                error: 2,
                msg: 'error write to GridFS'
            }
        } else {
            // write the file id to the req so next middlewares can see it
            data.id = result.id

            req._upload.file = data
        }

        // remove file from temp folder
        fs.unlink(file.path, () => {})

        next()
    })  // end upload
}
