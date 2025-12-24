import { RTCPeerConnection } from "react-native-webrtc";

export default class MyCloudWebRTC {
  constructor(serverID,serverName, clientID) {
    this.SERVER_NAME = serverName;
    this.SERVER_ID = serverID;
    this.CLIENT_ID = clientID;
    this.SIGNALING_WS = "ws://144.24.158.26:8080";
    this.ws = null;
    this.pc = null;
    this.dc = null;
    this.isConnected = false;
    this.onMessageCallback = null;
    this.onConnected = null;
    this.onError = null;
  }

  async start() {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.SIGNALING_WS);

        this.ws.onopen = () => {
          console.log("🌐 Connected to signaling server");
          this.ws.send(JSON.stringify({ type: "register", id: this.CLIENT_ID }));
          this.startConnection();
          resolve();
        };

        this.ws.onmessage = (msg) => this.handleMessage(msg);

        this.ws.onerror = (err) => {
          console.log("❌ WebSocket error:", err);
          if (this.onError) this.onError(err);
          reject(err);
        };

        this.ws.onclose = () => {
          console.log("🔌 Signaling connection closed");
        };
      } catch (err) {
        console.error("❌ Failed to start WebRTC:", err);
        reject(err);
      }
    });
  }

  async handleMessage(msg) {
    const data = JSON.parse(msg.data);
    if (data.type === "signal" && data.from === this.SERVER_ID) {
      const payload = JSON.parse(data.payload);

      if (payload.type === "answer") {
        await this.pc.setRemoteDescription({
          type: "answer",
          sdp: payload.sdp,
        });
        console.log("✅ Answer received from server");
      } else if (payload.type === "candidate") {
        if (payload.candidate && payload.candidate.candidate) {
          try {
            await this.pc.addIceCandidate(payload.candidate);
            console.log("🧊 Added ICE candidate");
          } catch (err) {
            console.error("❌ ICE add error:", err);
          }
        }
      }
    }
  }

  async startConnection() {
    this.pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        {
          urls: "turn:144.24.158.26:3478",
          username: "mycloudturn",
          credential: "##mycloudturn@@oracle",
        },
      ],
    });

    // Data channel
    this.dc = this.pc.createDataChannel("mycloud");

    this.dc.onopen = () => {
      console.log("📡 DataChannel open");
      this.isConnected=true;
      if (this.onConnected) this.onConnected();
    };

    this.dc.onmessage = (e) => {
      console.log("📦 Server says:", e.data);
      if (this.onMessageCallback) this.onMessageCallback(e.data);
    };

    this.pc.onicecandidate = (e) => {
      const cand = e.candidate;
      if (cand && cand.candidate) {
        this.ws.send(
          JSON.stringify({
            type: "signal",
            to: this.SERVER_ID,
            payload: JSON.stringify({
              type: "candidate",
              candidate: {
                candidate: cand.candidate,
                sdpMid: cand.sdpMid,
                sdpMLineIndex: cand.sdpMLineIndex,
              },
            }),
          })
        );
      }
    };

    // Create and send offer
    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);

    this.ws.send(
      JSON.stringify({
        type: "signal",
        to: this.SERVER_ID,
        payload: JSON.stringify({
          type: "offer",
          sdp: offer.sdp,
        }),
      })
    );
    console.log("📨 Offer sent to server");
  }

  sendCommand(cmd) {
    return new Promise((resolve) => {
    const handler = (event) => {
      this.dc.removeEventListener("message", handler);
      resolve(event.data);
    };
    this.dc.addEventListener("message", handler);

    if (this.dc && this.dc.readyState === "open") {
      console.log("🚀 Sending:", cmd);
      this.dc.send(cmd);
    } else {
      console.warn("⚠️ DataChannel not open yet");
    }
    });
  }

  getIsConnected(){
    return this.isConnected;
  }

  close() {
    if (this.dc) this.dc.close();
    if (this.pc) this.pc.close();
    if (this.ws) this.ws.close();
    this.isConnected=false;
    console.log("🔌 All connections closed");
  }

  // Optional: set callback when message received
  onMessage(callback) {
    this.onMessageCallback = callback;
  }

  // Optional: set callback when connected
  onConnect(callback) {
    this.onConnected = callback;
  }

  // Optional: set callback for errors
  onErrorCallback(callback) {
    this.onError = callback;
  }
}