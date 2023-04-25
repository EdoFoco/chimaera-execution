Data Structure

// Groups:
// [
// {
// "key",
// "wallets": {} Set<string>
// }
//]

// Data structure:
//GroupData:
// {
// "key": "",
// "rules": [
// {
// "type": "MinCallersCount",
// "effect": "BeforeTrade",
// "params": {
// "min": "3",
// }
// },
//
// {
// "type": "MaxTimeIntervalBetweenFirstAndLastBuy",
// "effect": "BeforeTrade",
// "params": {
// "maxHours": "24",
// }
// },
// {
// "type": "SellInitial",
// "operation": "DuringTrade",
// "params": {
// "tpPercentage": "200",
// }
// },
// ],
// "watchingTokens": {
// "{address}": {
// "callers": {} // Record<string, Date>
// }
//}
// }

// Tokens: Record<string, TokenData>
// {
// "{address}": {
// "meta": {} // Token Metadata,
// "primaryGroup": "", // string
// "calledByGroups": {}, // Set<string>,
// "callers": {}, // Record<string, Date>
// "operations": [
// {
// "type": "sell",
// "date": "",
// "txhash": ""},
// "trigger": "SellInitials"
// }
// ]
// }  
//
