"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DECODER_ERRORS = void 0;
var node_zlib_1 = __importDefault(require("node:zlib"));
exports.DECODER_ERRORS = {
    WRONG_MESSAGE_FORMAT: "wrong message format",
    ZIP_DECOMPRESSION_ERROR: "zip decompression failed"
};
var MadMessageDecoder = (function () {
    function MadMessageDecoder(bMessage, cb, debug) {
        this.id = undefined;
        this.type = undefined;
        this.content = undefined;
        this.finalize = false;
        this.isResponse = true;
        this.num = 0;
        this.length = 0;
        this.transferredLength = 0;
        this.zip = '0';
        this.debug = debug;
        this.read(bMessage, cb);
    }
    MadMessageDecoder.prototype.get_attr = function (attrName) {
        return this[attrName];
    };
    MadMessageDecoder.prototype.read = function (bMessage, cb) {
        if (bMessage.length < 69) {
            this.read_error(new Error(exports.DECODER_ERRORS.WRONG_MESSAGE_FORMAT), cb);
            return;
        }
        var reqId = bMessage.subarray(0, 36).toString().trim();
        var reqNum = bMessage.subarray(36, 46).toString().trim();
        var reqFinalize = bMessage.subarray(46, 47).toString().trim();
        var reqType = bMessage.subarray(47, 48).toString().trim();
        var reqLength = parseInt(bMessage.subarray(48, 68).toString().trim(), 10);
        var reqCompression = bMessage.subarray(68, 69).toString().trim();
        this.id = reqId;
        this.num = parseInt(reqNum, 10);
        this.type = reqType;
        this.length = this.transferredLength = reqLength;
        this.zip = reqCompression;
        this.finalize = parseInt(reqFinalize, 10) === 1;
        switch (this.compression_supported(reqCompression)) {
            case false:
                this.read_uncompressed({ bMessage: bMessage, reqType: reqType, reqLength: reqLength }, cb);
                break;
            default:
                this.read_unzip(reqCompression, { bMessage: bMessage, reqType: reqType, reqLength: reqLength }, cb);
        }
    };
    MadMessageDecoder.prototype.read_content = function (type, buf) {
        return ['j', 'm'].includes(type)
            ? JSON.parse(buf.toString('utf-8'))
            : buf;
    };
    MadMessageDecoder.prototype.read_uncompressed = function (props, cb) {
        var bMessage = props.bMessage, reqType = props.reqType, reqLength = props.reqLength;
        this.content = this.read_content(reqType, bMessage.subarray(69, reqLength + 69));
        this.read_done(cb);
    };
    MadMessageDecoder.prototype.read_unzip = function (zip, props, cb) {
        var _this = this;
        var bMessage = props.bMessage, reqType = props.reqType, reqLength = props.reqLength;
        var zipContent = bMessage.subarray(69, reqLength + 69);
        var unzipCmd = this.unzip_cmd(zip);
        var totalTime = 0;
        if (this.debug) {
            totalTime = Date.now();
        }
        unzipCmd(zipContent, function (e, plainContent) {
            if (e) {
                _this.read_error(new Error(exports.DECODER_ERRORS.ZIP_DECOMPRESSION_ERROR), cb);
            }
            else {
                _this.length = plainContent.length;
                _this.content = _this.read_content(reqType, plainContent);
                if (_this.debug) {
                    totalTime = Date.now() - totalTime;
                    console.log("[Decoder] ".concat(_this.zip, " total decoding time: ").concat(totalTime, " ms"));
                }
                _this.read_done(cb);
            }
        });
    };
    MadMessageDecoder.prototype.read_done = function (cb) {
        cb(null, this);
    };
    MadMessageDecoder.prototype.read_error = function (e, cb) {
        cb(e, this);
    };
    MadMessageDecoder.prototype.unzip_cmd = function (zip) {
        switch (zip) {
            case 'i':
                return node_zlib_1.default.inflate;
            case 'b':
                return node_zlib_1.default.brotliDecompress;
            default:
                return node_zlib_1.default.gunzip;
        }
    };
    MadMessageDecoder.prototype.compression_supported = function (compression) {
        return ['g', 'i', 'b'].includes(compression);
    };
    return MadMessageDecoder;
}());
exports.default = MadMessageDecoder;
//# sourceMappingURL=Decoder.js.map