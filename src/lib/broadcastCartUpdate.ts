export default function broadcastCartUpdate() {
  try {
    const bc = new BroadcastChannel("movie_cart");
    bc.postMessage({ type: "updated" });
    bc.close();
  } catch (err) {
    // Fallback for browsers without BroadcastChannel
    window.dispatchEvent(new Event("movie_cart:updated"));
  }
}
