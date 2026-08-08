"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const finance_service_1 = require("./finance.service");
let FinanceController = class FinanceController {
    financeService;
    constructor(financeService) {
        this.financeService = financeService;
    }
    getAll(req, champId) {
        return this.financeService.getFees(req.user.id, champId);
    }
    createFee(req, champId, body) {
        return this.financeService.createFee(req.user.id, champId, body);
    }
    createBulkFees(req, champId, body) {
        return this.financeService.createBulkFees(req.user.id, champId, body);
    }
    markPaid(req, champId, feeId) {
        return this.financeService.markFeePaid(req.user.id, champId, feeId);
    }
    markUnpaid(req, champId, feeId) {
        return this.financeService.markFeeUnpaid(req.user.id, champId, feeId);
    }
    deleteFee(req, champId, feeId) {
        return this.financeService.deleteFee(req.user.id, champId, feeId);
    }
    createExpense(req, champId, body) {
        return this.financeService.createExpense(req.user.id, champId, body);
    }
    deleteExpense(req, champId, expenseId) {
        return this.financeService.deleteExpense(req.user.id, champId, expenseId);
    }
};
exports.FinanceController = FinanceController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('championshipId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getAll", null);
__decorate([
    (0, common_1.Post)('fees'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('championshipId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createFee", null);
__decorate([
    (0, common_1.Post)('fees/bulk'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('championshipId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createBulkFees", null);
__decorate([
    (0, common_1.Put)('fees/:feeId/pay'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('championshipId')),
    __param(2, (0, common_1.Param)('feeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "markPaid", null);
__decorate([
    (0, common_1.Put)('fees/:feeId/unpay'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('championshipId')),
    __param(2, (0, common_1.Param)('feeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "markUnpaid", null);
__decorate([
    (0, common_1.Delete)('fees/:feeId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('championshipId')),
    __param(2, (0, common_1.Param)('feeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "deleteFee", null);
__decorate([
    (0, common_1.Post)('expenses'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('championshipId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createExpense", null);
__decorate([
    (0, common_1.Delete)('expenses/:expenseId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('championshipId')),
    __param(2, (0, common_1.Param)('expenseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "deleteExpense", null);
exports.FinanceController = FinanceController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Controller)('championships/:championshipId/finance'),
    __metadata("design:paramtypes", [finance_service_1.FinanceService])
], FinanceController);
//# sourceMappingURL=finance.controller.js.map