"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = __importStar(require("."));
var sleep = function (ms) {
    return new Promise(function (resolve) {
        return setTimeout(resolve, ms);
    });
};
describe("Encoder lifecycle and props", function () {
    it("spawns an encoder", function () {
        var spy = jest.fn();
        var enc = new _1.default({
            content: { hello: "world" },
        }, spy);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(null, enc);
        expect(enc.buffer).toBeDefined();
        if (enc.buffer) {
            expect(enc.buffer.length).toBeGreaterThan(0);
        }
    });
    it("spawns a gzip encoder", function () { return __awaiter(void 0, void 0, void 0, function () {
        var spy, enc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    spy = jest.fn();
                    enc = new _1.default({
                        content: { hello: "world" },
                        zip: "gzip"
                    }, spy);
                    return [4, sleep(1000)];
                case 1:
                    _a.sent();
                    expect(spy).toHaveBeenCalledTimes(1);
                    expect(spy).toHaveBeenCalledWith(null, enc);
                    expect(enc.buffer).toBeDefined();
                    if (enc.buffer) {
                        expect(enc.buffer.length).toBeGreaterThan(0);
                    }
                    return [2];
            }
        });
    }); });
    it("spawns an inflate encoder and finalize=false", function () { return __awaiter(void 0, void 0, void 0, function () {
        var spy, enc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    spy = jest.fn();
                    enc = new _1.default({
                        requestId: "emulated-uid",
                        content: { hello: "world" },
                        zip: "inflate",
                        finalize: false
                    }, spy);
                    expect(enc.id).toEqual("emulated-uid");
                    return [4, sleep(1000)];
                case 1:
                    _a.sent();
                    expect(spy).toHaveBeenCalledTimes(1);
                    expect(spy).toHaveBeenCalledWith(null, enc);
                    expect(enc.buffer).toBeDefined();
                    if (enc.buffer) {
                        expect(enc.buffer.length).toBeGreaterThan(0);
                    }
                    return [2];
            }
        });
    }); });
    it("spawns an inflate encoder with a binary message", function () { return __awaiter(void 0, void 0, void 0, function () {
        var spy, enc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    spy = jest.fn();
                    enc = new _1.default({
                        type: "b",
                        content: Buffer.from("HelloWorld!"),
                        zip: "inflate",
                        finalize: true
                    }, spy);
                    return [4, sleep(1000)];
                case 1:
                    _a.sent();
                    expect(spy).toHaveBeenCalledTimes(1);
                    expect(spy).toHaveBeenCalledWith(null, enc);
                    expect(enc.buffer).toBeDefined();
                    if (enc.buffer) {
                        expect(enc.buffer.length).toBeGreaterThan(0);
                    }
                    return [2];
            }
        });
    }); });
    it("spawns an inflate encoder with a binary null message", function () { return __awaiter(void 0, void 0, void 0, function () {
        var spy, enc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    spy = jest.fn();
                    enc = new _1.default({
                        type: "b",
                        content: null,
                        zip: "inflate",
                        finalize: true
                    }, spy);
                    return [4, sleep(1000)];
                case 1:
                    _a.sent();
                    expect(spy).toHaveBeenCalledTimes(1);
                    expect(spy).toHaveBeenCalledWith(null, enc);
                    expect(enc.buffer).toBeDefined();
                    if (enc.buffer) {
                        expect(enc.buffer.length).toBeGreaterThan(0);
                    }
                    return [2];
            }
        });
    }); });
    it("spawns a brotli encoder", function () { return __awaiter(void 0, void 0, void 0, function () {
        var spy, enc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    spy = jest.fn();
                    enc = new _1.default({
                        content: { hello: "world" },
                        zip: "brotli"
                    }, spy, true);
                    return [4, sleep(1000)];
                case 1:
                    _a.sent();
                    expect(spy).toHaveBeenCalledTimes(1);
                    expect(spy).toHaveBeenCalledWith(null, enc);
                    expect(enc.buffer).toBeDefined();
                    if (enc.buffer) {
                        expect(enc.buffer.length).toBeGreaterThan(0);
                        expect(enc.toArrayBuffer(enc.buffer) instanceof ArrayBuffer).toBeTruthy();
                    }
                    return [2];
            }
        });
    }); });
    it("fails caused by wrong json content", function () { return __awaiter(void 0, void 0, void 0, function () {
        var spy, enc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    spy = jest.fn();
                    enc = new _1.default({
                        content: "HelloWorld!",
                        zip: "brotli",
                    }, spy);
                    return [4, sleep(1000)];
                case 1:
                    _a.sent();
                    expect(spy).toHaveBeenCalledTimes(1);
                    expect(spy).toHaveBeenCalledWith(new Error(_1.ENCODER_ERRORS.WRONG_MESSAGE_CONTENT), enc);
                    return [2];
            }
        });
    }); });
    it("fails caused by failure during zip", function () { return __awaiter(void 0, void 0, void 0, function () {
        var spy, enc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    spy = jest.fn();
                    enc = new _1.default({
                        content: { hello: "world" },
                        zip: "gzip"
                    }, spy);
                    return [4, sleep(1000)];
                case 1:
                    _a.sent();
                    expect(spy).toHaveBeenCalledTimes(1);
                    spy.mockClear();
                    enc.zip_cmd = jest.fn(function () { return function (content, cb) {
                        cb(new Error("Emulated zip error"), Buffer.from(""));
                    }; });
                    enc.build();
                    expect(spy).toHaveBeenCalledTimes(1);
                    expect(spy).toHaveBeenCalledWith(new Error(_1.ENCODER_ERRORS.ZIP_COMPRESS_ERROR), enc);
                    return [2];
            }
        });
    }); });
});
//# sourceMappingURL=Encoder.test.js.map