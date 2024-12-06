setCookie("username", "testUser", 1); // Sets a cookie "username" with value "testUser" for 1 day

console.log("Cookie set:", getCookie("username")); // Should log "testUser"

// Wait a few seconds and then try to retrieve the cookie again
setTimeout(() => {
    console.log("Retrieved Cookie:", getCookie("username")); // Should still log "testUser"
}, 2000);
