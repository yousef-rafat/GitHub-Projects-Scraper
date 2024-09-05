function detectAndConvertKNumbers(arr) {
    const regex = /^(\d+(\.\d+)?)([kK])$/;
    return arr.map(item => {
        if (typeof item === 'string') {
            const match = item.match(regex);
            if (match) {
                let number = parseFloat(match[1]);
                const suffix = match[3].toLowerCase();
                if (suffix === 'k') {
                    number *= 1000;
                }
                return number;
            }
        }
        return item;
    });
}

module.exports = detectAndConvertKNumbers;