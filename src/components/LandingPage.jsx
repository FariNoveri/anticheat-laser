import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logoImg from "../img/logo.png";
import "./LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();
  const [showTopBtn, setShowTopBtn] = useState(false);

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
          <a href="#pricing" onClick={(e) => { e.preventDefault(); document.getElementById("pricing").scrollIntoView({behavior: "smooth"}); }}>Pricing</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="cutecore-hero">
        <div className="hero-content">
          <div style={{ display: "inline-block", background: "#ff66b2", color: "#fff", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", marginBottom: "15px", letterSpacing: "1px" }}>LATEST VERSION 5.2</div>
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
            <div className="price" style={{fontSize: "42px"}}>200<br/><span style={{fontSize: "20px", color: "#8c5a77"}}>Robux</span></div>
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
            <div className="price" style={{fontSize: "42px"}}>400<br/><span style={{fontSize: "20px", color: "#8c5a77"}}>Robux</span></div>
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
            <div className="price" style={{fontSize: "42px"}}>1000<br/><span style={{fontSize: "20px", color: "#8c5a77"}}>Robux</span></div>
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
            <div className="price" style={{fontSize: "42px"}}>Rp150k</div>
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
    </div>
  );
}
