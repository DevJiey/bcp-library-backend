const {
    createAuditLog,
    getAuditLogs,
    countAuditLogs,
} = require("../repositories/AuditLogRepository");

const {
    parsePagination,
    createPaginationMeta,
} = require("../utils/pagination");

const recordAuditLog = async ({
    userId,
    action,
    module,
    entityType,
    entityId,
    description,
    ipAddress,
    userAgent,
}) => {
    return await createAuditLog({
        userId,
        action,
        module,
        entityType,
        entityId,
        description,
        ipAddress,
        userAgent,
    });
};

const listAuditLogs = async ({
    userId,
    action,
    module,
    entityType,
    page = 1,
    limit = 20,
}) => {
    const pagination = parsePagination({
        page,
        limit,
        maxLimit: 100,
    });

    const filters = {
        userId: userId || null,
        action: action || null,
        module: module || null,
        entityType: entityType || null,
    };

    const [logs, total] = await Promise.all([
        getAuditLogs({
            ...filters,
            limit: pagination.limit,
            offset: pagination.offset,
        }),

        countAuditLogs(filters),
    ]);

    return {
        logs,

        pagination: createPaginationMeta({
            page: pagination.page,
            limit: pagination.limit,
            total,
        }),
    };
};

module.exports = {
    recordAuditLog,
    listAuditLogs,
};