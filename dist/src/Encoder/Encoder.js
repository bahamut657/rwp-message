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
    function MadMessageEncoder(_a, cb, debug) {
        var _b = _a.type, type = _b === void 0 ? 'j' : _b, content = _a.content, requestId = _a.requestId, _c = _a.num, num = _c === void 0 ? 0 : _c, _d = _a.finalize, finalize = _d === void 0 ? true : _d, _e = _a.zip, zip = _e === void 0 ? "" : _e;
        if (debug === void 0) { debug = false; }
        this.id = requestId !== null && requestId !== void 0 ? requestId : (0, uuid_1.v4)();
        this.input = { type: type, content: content, requestId: requestId, num: num, finalize: finalize, zip: zip };
        this.isResponse = false;
        this.length = 0;
        this.buffer;
        this.debug = debug;
        this.cb = cb;
        this.build();
    }
    MadMessageEncoder.prototype.build = function () {
        var _a = this.input, _b = _a.type, type = _b === void 0 ? 'j' : _b, _c = _a.num, num = _c === void 0 ? 0 : _c, _d = _a.content, content = _d === void 0 ? null : _d, finalize = _a.finalize, requestId = _a.requestId, zip = _a.zip;
        var uid = this.requestId = requestId || (0, uuid_1.v4)();
        var bRequestId = ('                                    ' + uid).slice(-36);
        var bNum = ('          ' + num.toString()).slice(-10);
        var bFinalize = finalize ? '1' : '0';
        var bType = type;
        if (['j', 'm'].includes(type)) {
            if (content && typeof content !== 'object') {
                this.build_error(new Error(exports.ENCODER_ERRORS.WRONG_MESSAGE_CONTENT));
                return;
            }
        }
        var bContent = ['j', 'm'].includes(type)
            ? Buffer.from(JSON.stringify(content))
            : Buffer.from(content || '');
        this.id = uid;
        var bMessage = {
            content: bContent,
            requestId: bRequestId,
            num: bNum,
            finalize: bFinalize,
            type: bType,
            zip: zip
        };
        if (!zip) {
            this.build_uncompressed(bMessage);
        }
        else {
            this.build_zip(zip, bMessage);
        }
    };
    MadMessageEncoder.prototype.build_uncompressed = function (props) {
        var content = props.content, requestId = props.requestId, _a = props.num, num = _a === void 0 ? 0 : _a, finalize = props.finalize, _b = props.type, type = _b === void 0 ? 'j' : _b;
        var contentLength = content.length;
        var reqLength = ('                    ' + contentLength.toString()).slice(-20);
        this.length = contentLength;
        this.buffer = Buffer.concat([
            Buffer.from(requestId),
            Buffer.from(num.toString()),
            Buffer.from(finalize),
            Buffer.from(type),
            Buffer.from(reqLength),
            Buffer.from('0'),
            content
        ]);
        this.build_done();
    };
    MadMessageEncoder.prototype.build_zip = function (zip, props) {
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
                _this.build_error(new Error(exports.ENCODER_ERRORS.ZIP_COMPRESS_ERROR));
            }
            else {
                var zipLength = zipContent.length;
                var zipReqLength = ('                    ' + zipLength.toString()).slice(-20);
                _this.length = zipLength;
                _this.buffer = Buffer.concat([
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
                _this.build_done();
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
    MadMessageEncoder.prototype.build_done = function () {
        this.cb(null, this);
    };
    MadMessageEncoder.prototype.build_error = function (e) {
        this.cb(e, this);
    };
    return MadMessageEncoder;
}());
exports.default = MadMessageEncoder;
//# sourceMappingURL=Encoder.js.map