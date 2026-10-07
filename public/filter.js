// Runs before first paint so a saved "filter off" choice does not flash.
try {
  if (localStorage.getItem("filter") === "off") {
    document.documentElement.dataset.filter = "off";
  }
} catch (e) {}
