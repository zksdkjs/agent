"use strict";
/**
 * Core types and interfaces for zkSDK
 * The LangChain of Privacy
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePrivacyProvider = void 0;
/**
 * Base interface for all privacy providers
 */
class BasePrivacyProvider {
    constructor(config = {}) {
        this.config = config;
    }
    /**
     * Validate transfer parameters
     */
    validateTransferParams(params) {
        if (!params.chain) {
            throw new Error('Chain is required');
        }
        if (!params.token) {
            throw new Error('Token is required');
        }
        if (!params.amount || params.amount === '0') {
            throw new Error('Amount must be greater than 0');
        }
        if (!params.to) {
            throw new Error('Recipient address is required');
        }
        if (!params.privacy) {
            throw new Error('Privacy level is required');
        }
    }
}
exports.BasePrivacyProvider = BasePrivacyProvider;
//# sourceMappingURL=index.js.map