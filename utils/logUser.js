module.exports = logUser = (username) =>{
    console.log(`${username} s'est connecté | ${new Date().toLocaleDateString()} | ${new Date().toLocaleTimeString()}`)
} 