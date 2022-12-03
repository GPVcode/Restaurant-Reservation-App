const zeroCheck = (number) => {
    if(number.toString().length === 1){
        return "0" + number;
    }
    return number;
}

// changes date by a day and return string in YYYY-MM-DD format
export default function makeDate(augment = 0){
const augDate = new Date();
const today = new Date(augDate.setDate(augDate.getDate() + augment));
const year = today.getFullYear();
const month = today.getMonth() + 1;
const day = today.getDate();
return year + "-" + zeroCheck(month) + "-" + zeroCheck(day);
}