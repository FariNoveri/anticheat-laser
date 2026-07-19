import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logoImg from "../img/logo.png";
import "./LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [showChangelogPopup, setShowChangelogPopup] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (showChangelogPopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [showChangelogPopup]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="cutecore-page">
      {/* Snow Effects */}
      <div className="snow-layer layer-1"></div>
      <div className="snow-layer layer-2"></div>
      <div className="snow-layer layer-3"></div>

      {/* Navigation */}
      <nav className="cutecore-nav">
        <div className="cutecore-logo" style={{ display: "flex", alignItems: "center" }}>
          <img src={logoImg} alt="Laser Suite Logo" style={{ height: "45px" }} />
        </div>
        <div className="cutecore-nav-links">
          <a href="#features" onClick={(e) => { e.preventDefault(); document.getElementById("features").scrollIntoView({behavior: "smooth"}); }}>Features</a>
          <a href="#updates" onClick={(e) => { e.preventDefault(); document.getElementById("updates").scrollIntoView({behavior: "smooth"}); }}>Updates</a>
          <a href="#pricing" onClick={(e) => { e.preventDefault(); document.getElementById("pricing").scrollIntoView({behavior: "smooth"}); }}>Pricing</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="cutecore-hero">
        <div className="hero-content">
          <div style={{ display: "inline-block", background: "#ff66b2", color: "#fff", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", marginBottom: "15px", letterSpacing: "1px" }}>LATEST VERSION 5.5</div>
          <h1>The Cutest, Most Powerful<br/>Roblox Anti-Cheat</h1>
          <p>Protect your games from exploiters with our ultra-fast, server-sided validation system. Real-time Discord webhooks, zero false positives, and 100% bypass-proof. <br/><strong>100% Safe & Compliant with Roblox TOS.</strong></p>
          <button className="cutecore-btn" onClick={() => document.getElementById("pricing").scrollIntoView({behavior: "smooth"})}>
            Get Protected Now
          </button>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="cutecore-features">
        <div className="cutecore-card">
          <div className="cutecore-card-icon"></div>
          <h3>Keep Hidden</h3>
          <p>Top secret bypass-proof detection methods. Cuman Fari Noveri yang tau.</p>
        </div>
        <div className="cutecore-card">
          <div className="cutecore-card-icon"></div>
          <h3>Always Update</h3>
          <p>Continuously updated behind the scenes to patch the latest vulnerabilities.</p>
        </div>
        <div className="cutecore-card">
          <div className="cutecore-card-icon"></div>
          <h3>Discord Webhooks</h3>
          <p>Get real-time alerts sent straight to your Discord server whenever someone is caught.</p>
        </div>
      </section>

      {/* Release Notes Button */}
      <section id="updates" className="cutecore-pricing" style={{ background: "transparent", paddingTop: 0, paddingBottom: 40 }}>
        <h2>Update Changelog</h2>
        <p style={{ color: "#8c5a77", marginBottom: "30px", fontSize: "16px", marginTop: "-10px", fontStyle: "italic" }}>See what's new in the latest versions!</p>
        <button className="cutecore-btn" onClick={() => setShowChangelogPopup(true)}>
          View Update Changelog
        </button>
      </section>

      {/* Pricing - Robux */}
      <section id="pricing" className="cutecore-pricing">
        <h2>Purchase via Robux</h2>
        <p style={{color: "#8c5a77", marginBottom: "40px", fontSize: "18px"}}>
          Buy directly in our game! Automatic activation.<br/>
          <a href="https://www.roblox.com/games/129854094474638/Testing-Code-Map" target="_blank" rel="noreferrer" style={{color: "#ff3399", fontWeight: "bold", textDecoration: "none"}}>
            Click here to play the map
          </a>
        </p>
        <div className="pricing-grid">
          
          <div className="pricing-card">
            <h3>Trial Plan</h3>
            <div className="price" style={{fontSize: "42px"}}>286<br/><span style={{fontSize: "20px", color: "#8c5a77"}}>Robux</span><br/><span style={{fontSize: "20px", color: "#ff66b2"}}>(200)</span></div>
            <p style={{color: "#8c5a77", marginBottom: 20}}>For 3 Days</p>
            <ul className="pricing-features">
              <li>3 Days Access</li>
              <li>1 Game ID Slot</li>
              <li>Premium Protection</li>
              <li>Discord Webhooks</li>
            </ul>
            <a href="https://www.roblox.com/games/129854094474638/Testing-Code-Map" target="_blank" rel="noreferrer">
              <button className="cutecore-btn" style={{width: "100%", padding: "12px", fontSize: "16px"}}>
                Buy via Game
              </button>
            </a>
          </div>

          <div className="pricing-card popular">
            <div className="popular-badge">POPULAR</div>
            <h3>Weekly Plan</h3>
            <div className="price" style={{fontSize: "42px"}}>572<br/><span style={{fontSize: "20px", color: "#8c5a77"}}>Robux</span><br/><span style={{fontSize: "20px", color: "#ff66b2"}}>(400)</span></div>
            <p style={{color: "#8c5a77", marginBottom: 20}}>For 7 Days</p>
            <ul className="pricing-features">
              <li>7 Days Access</li>
              <li>1 Game ID Slot</li>
              <li>Premium Protection</li>
              <li>Discord Webhooks</li>
            </ul>
            <a href="https://www.roblox.com/games/129854094474638/Testing-Code-Map" target="_blank" rel="noreferrer">
              <button className="cutecore-btn" style={{width: "100%", padding: "12px", fontSize: "16px"}}>
                Buy via Game
              </button>
            </a>
          </div>

          <div className="pricing-card">
            <h3>Monthly Plan</h3>
            <div className="price" style={{fontSize: "42px"}}>2286<br/><span style={{fontSize: "20px", color: "#8c5a77"}}>Robux</span><br/><span style={{fontSize: "20px", color: "#ff66b2"}}>(1600)</span></div>
            <p style={{color: "#8c5a77", marginBottom: 20}}>For 1 Month</p>
            <ul className="pricing-features">
              <li>1 Month Access</li>
              <li>1 Game ID Slot</li>
              <li>Premium Protection</li>
              <li>Discord Webhooks</li>
            </ul>
            <a href="https://www.roblox.com/games/129854094474638/Testing-Code-Map" target="_blank" rel="noreferrer">
              <button className="cutecore-btn" style={{width: "100%", padding: "12px", fontSize: "16px"}}>
                Buy via Game
              </button>
            </a>
          </div>

        </div>
      </section>

      {/* Pricing - Real Money */}
      <section className="cutecore-pricing" style={{paddingTop: 0}}>
        <h2>Purchase via Real Money</h2>
        <div style={{background: "rgba(255, 255, 255, 0.7)", padding: "20px", borderRadius: "15px", maxWidth: "600px", margin: "0 auto 40px auto", border: "2px dashed #ff66b2"}}>
          <p style={{color: "#5c3a4f", fontSize: "16px", margin: 0, lineHeight: "1.6"}}>
            <strong>1. Transfer ke:</strong> <span style={{fontSize: "18px", color: "#ff3399", fontWeight: "bold"}}>083809803142</span><br/>
            (DANA / GoPay / OVO / ShopeePay) a.n <strong>Fari Noveri</strong><br/><br/>
            <strong>2. Kirim Bukti Transfer ke:</strong><br/>
            Discord ID: <strong><a href="https://discordapp.com/users/400647757343490049" target="_blank" rel="noreferrer" style={{color: "#ff3399"}}>400647757343490049</a></strong> (Fari Noveri)<br/>
            IG: <strong>@fariinoveri</strong> | TikTok: <strong>@fari_noveri</strong>
          </p>
        </div>
        <div className="pricing-grid">
          
          <div className="pricing-card">
            <h3>Trial Plan</h3>
            <div className="price" style={{fontSize: "42px"}}>Rp30k</div>
            <p style={{color: "#8c5a77", marginBottom: 20}}>For 3 Days</p>
            <ul className="pricing-features">
              <li>3 Days Access</li>
              <li>1 Game ID Slot</li>
              <li>Premium Protection</li>
              <li>Discord Webhooks</li>
            </ul>
            <a href="https://discordapp.com/users/400647757343490049" target="_blank" rel="noreferrer">
              <button className="cutecore-btn" style={{width: "100%", padding: "12px", fontSize: "16px"}}>
                Contact Fari
              </button>
            </a>
          </div>

          <div className="pricing-card popular">
            <div className="popular-badge">POPULAR</div>
            <h3>Weekly Plan</h3>
            <div className="price" style={{fontSize: "42px"}}>Rp60k</div>
            <p style={{color: "#8c5a77", marginBottom: 20}}>For 7 Days</p>
            <ul className="pricing-features">
              <li>7 Days Access</li>
              <li>1 Game ID Slot</li>
              <li>Premium Protection</li>
              <li>Discord Webhooks</li>
            </ul>
            <a href="https://discordapp.com/users/400647757343490049" target="_blank" rel="noreferrer">
              <button className="cutecore-btn" style={{width: "100%", padding: "12px", fontSize: "16px"}}>
                Contact Fari
              </button>
            </a>
          </div>

          <div className="pricing-card">
            <h3>Monthly Plan</h3>
            <div className="price" style={{fontSize: "42px"}}>Rp240k</div>
            <p style={{color: "#8c5a77", marginBottom: 20}}>For 1 Month</p>
            <ul className="pricing-features">
              <li>1 Month Access</li>
              <li>1 Game ID Slot</li>
              <li>Premium Protection</li>
              <li>Discord Webhooks</li>
            </ul>
            <a href="https://discordapp.com/users/400647757343490049" target="_blank" rel="noreferrer">
              <button className="cutecore-btn" style={{width: "100%", padding: "12px", fontSize: "16px"}}>
                Contact Fari
              </button>
            </a>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="cutecore-footer">
        <p>Crafted by <strong>Fari Noveri</strong></p>
      </footer>

      {/* Back to Top Button */}
      <button 
        className={`back-to-top ${showTopBtn ? 'visible' : ''}`} 
        onClick={scrollToTop}
        title="Go to top"
      >
        ↑
      </button>
      {/* Changelog Popup Modal */}
      {showChangelogPopup && (
        <div className="modal-overlay" onClick={() => setShowChangelogPopup(false)} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ background: "#fff", width: "100%", maxWidth: "800px", maxHeight: "80vh", borderRadius: "20px", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
            <div style={{ padding: "20px", background: "#ffb3d9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ margin: 0, color: "#fff", fontSize: "24px" }}>Update Changelog</h2>
              <button onClick={() => setShowChangelogPopup(false)} style={{ background: "transparent", border: "none", color: "#fff", fontSize: "24px", cursor: "pointer", fontWeight: "bold" }}>×</button>
            </div>
            <div style={{ padding: "20px", overflowY: "auto", textAlign: "left" }}>
              
              <div style={{ background: "rgba(255, 102, 178, 0.1)", padding: "20px 25px", borderRadius: "15px", marginBottom: "20px", borderLeft: "5px solid #ff1493" }}>
                <h3 style={{ margin: "0 0 10px 0", color: "#5c3a4f" }}>v5.5 — Custom Bans via Code</h3>
                <ul style={{ margin: 0, paddingLeft: "20px", color: "#8c5a77", lineHeight: "1.6" }}>
                  <li>Added `CustomBans.lua` for adding local hardcoded bans without Web Panel.</li>
                  <li>Intelligent array merging mechanism prioritizes Web Panel items automatically.</li>
                  <li>Fixed edge-cases in Discord Webhooks to prevent empty field rejection.</li>
                </ul>
              </div>

              <div style={{ background: "rgba(255, 102, 178, 0.05)", padding: "20px 25px", borderRadius: "15px", marginBottom: "20px", borderLeft: "5px solid #ff66b2" }}>
                <h3 style={{ margin: "0 0 10px 0", color: "#5c3a4f" }}>v5.4 — Payload Encryption & Modularity</h3>
                <ul style={{ margin: 0, paddingLeft: "20px", color: "#8c5a77", lineHeight: "1.6" }}>
                  <li>Added Luraph-style Custom Payload Encryption for ultimate API protection.</li>
                  <li>Refactored AntiCheat into ultra-clean Core modules (60 lines main script).</li>
                  <li>Adonis UI logs now include action (KICK/DISABLE) and user details.</li>
                </ul>
              </div>

              <div style={{ background: "rgba(255, 102, 178, 0.05)", padding: "20px 25px", borderRadius: "15px", marginBottom: "20px", borderLeft: "5px solid #ff99cc" }}>
                <h3 style={{ margin: "0 0 10px 0", color: "#5c3a4f" }}>v5.3 — Adonis Admin Integration</h3>
                <ul style={{ margin: 0, paddingLeft: "20px", color: "#8c5a77", lineHeight: "1.6" }}>
                  <li>Added deep integration with Adonis Admin system.</li>
                  <li>Automatically fires a bindable event for custom Adonis Exploit Logging.</li>
                  <li>Admins in-game now receive real-time UI exploit notifications.</li>
                </ul>
              </div>

              <div style={{ background: "rgba(255, 102, 178, 0.05)", padding: "20px 25px", borderRadius: "15px", marginBottom: "20px", borderLeft: "5px solid #ffb3d9" }}>
                <h3 style={{ margin: "0 0 10px 0", color: "#5c3a4f" }}>v5.2 — Cutecore & Troll Protection</h3>
                <ul style={{ margin: 0, paddingLeft: "20px", color: "#8c5a77", lineHeight: "1.6" }}>
                  <li>Revamped Landing Page with Cutecore Aesthetic.</li>
                  <li>Dynamic kick messages fully driven by Web Panel.</li>
                  <li>Added Troll Redirect (Rickroll) for API bypass attempts.</li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
