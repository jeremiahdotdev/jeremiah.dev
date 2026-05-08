export function getDurationBetweenDates(startDate: Date, endDate: Date) {
    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();

    if (endDay < startDay) {
        months--;
        if (months < 0) {
            years--;
            months += 12;
        }
    }

    // Adjust for cases where the month difference is negative
    if (months < 0) {
        years--;
        months += 12;
    }

    const yearsString = years ? `${years} yr${years > 1 ? "s": ""}` : ""
    const monthsString = months ? `${months} mo${months > 1 ? "s": ""}` : ""
    return [yearsString, monthsString].filter(Boolean).join(" ") || "Less than 1 mo"
}
