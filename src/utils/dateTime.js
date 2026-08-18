const addDays = (date, days) => {
    const result = new Date(date);

    result.setDate(
        result.getDate() + Number(days)
    );

    return result;
};

const calculateDueDate = (
    borrowingPeriodDays,
    startDate = new Date()
) => {
    return addDays(
        startDate,
        borrowingPeriodDays
    );
};

const isPastDue = (
    dueDate,
    currentDate = new Date()
) => {
    return new Date(dueDate) < new Date(currentDate);
};

module.exports = {
    addDays,
    calculateDueDate,
    isPastDue,
};