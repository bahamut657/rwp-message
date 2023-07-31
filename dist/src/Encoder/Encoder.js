"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENCODER_ERRORS = void 0;
var uuid_1 = require("uuid");
var node_zlib_1 = __importDefault(require("node:zlib"));
exports.ENCODER_ERRORS = {
    WRONG_MESSAGE_CONTENT: "wrong message content",
    ZIP_COMPRESS_ERROR: "zip compression failed"
};
var MadMessageEncoder = (function () {
    function MadMessageEncoder(debug) {
        if (debug === void 0) { debug = false; }
        this.debug = debug;
    }
    MadMessageEncoder.prototype.build = function (msg, cb) {
        var _a = msg.requestId, requestId = _a === void 0 ? (0, uuid_1.v4)() : _a, _b = msg.type, type = _b === void 0 ? 'j' : _b, _c = msg.num, num = _c === void 0 ? 0 : _c, _d = msg.content, content = _d === void 0 ? null : _d, finalize = msg.finalize, zip = msg.zip;
        var bRequestId = ('                                    ' + requestId).slice(-36);
        var bNum = ('          ' + num.toString()).slice(-10);
        var bFinalize = finalize ? '1' : '0';
        if (['j', 'm'].includes(type)) {
            if (content && typeof content !== 'object') {
                this.build_error(new Error(exports.ENCODER_ERRORS.WRONG_MESSAGE_CONTENT), cb);
                return;
            }
        }
        var bContent = ['j', 'm'].includes(type)
            ? Buffer.from(JSON.stringify(content))
            : Buffer.from(content || '');
        var output = {
            id: requestId,
            isResponse: false,
            length: 0,
            buffer: Buffer.from('')
        };
        var bMessage = {
            content: bContent,
            requestId: bRequestId,
            num: bNum,
            finalize: bFinalize,
            type: type,
            zip: zip
        };
        if (!zip) {
            this.build_uncompressed(bMessage, output, cb);
        }
        else {
            this.build_zip(zip, bMessage, output, cb);
        }
    };
    MadMessageEncoder.prototype.build_uncompressed = function (props, output, cb) {
        var content = props.content, requestId = props.requestId, _a = props.num, num = _a === void 0 ? 0 : _a, finalize = props.finalize, _b = props.type, type = _b === void 0 ? 'j' : _b;
        var contentLength = content.length;
        var reqLength = ('                    ' + contentLength.toString()).slice(-20);
        output.length = contentLength;
        output.buffer = Buffer.concat([
            Buffer.from(requestId),
            Buffer.from(num.toString()),
            Buffer.from(finalize),
            Buffer.from(type),
            Buffer.from(reqLength),
            Buffer.from('0'),
            content
        ]);
        this.build_done(output, cb);
    };
    MadMessageEncoder.prototype.build_zip = function (zip, props, output, cb) {
        var _this = this;
        var content = props.content, requestId = props.requestId, _a = props.num, num = _a === void 0 ? 0 : _a, finalize = props.finalize, _b = props.type, type = _b === void 0 ? 'j' : _b;
        var zipCmd = this.zip_cmd(zip);
        var totalTime = 0;
        if (this.debug) {
            totalTime = Date.now();
        }
        zipCmd(content, function (e, zipContent) {
            if (e) {
                console.log(e);
                _this.build_error(new Error(exports.ENCODER_ERRORS.ZIP_COMPRESS_ERROR), cb);
            }
            else {
                var zipLength = zipContent.length;
                var zipReqLength = ('                    ' + zipLength.toString()).slice(-20);
                output.length = zipLength;
                output.buffer = Buffer.concat([
                    Buffer.from(requestId),
                    Buffer.from(num.toString()),
                    Buffer.from(finalize),
                    Buffer.from(type),
                    Buffer.from(zipReqLength),
                    Buffer.from(zip.slice(0, 1)),
                    zipContent
                ]);
                if (_this.debug) {
                    totalTime = Date.now() - totalTime;
                    console.log("[Encoder] ".concat(zip, " total encoding time: ").concat(totalTime, "ms"));
                }
                _this.build_done(output, cb);
            }
        });
    };
    MadMessageEncoder.prototype.toArrayBuffer = function (buf) {
        var ab = new ArrayBuffer(buf.length);
        var view = new Uint8Array(ab);
        for (var i = 0; i < buf.length; ++i) {
            view[i] = buf[i];
        }
        return ab;
    };
    MadMessageEncoder.prototype.zip_cmd = function (zip) {
        switch (zip) {
            case 'inflate':
                return node_zlib_1.default.deflate;
            case 'brotli':
                return node_zlib_1.default.brotliCompress;
            default:
                return node_zlib_1.default.gzip;
        }
    };
    MadMessageEncoder.prototype.build_done = function (output, cb) {
        cb(null, output);
    };
    MadMessageEncoder.prototype.build_error = function (e, cb) {
        cb(e);
    };
    return MadMessageEncoder;
}());
exports.default = MadMessageEncoder;
//# sourceMappingURL=Encoder.js.map