
import { Link } from "react-router-dom";
import "./Privacy.css";

const Privacy = () => {
  return (
    <div className="privacy-page">

      {/* HERO */}
      <section className="privacy-hero">
        <div className="privacy-container">
          <Link to="/" className="privacy-back">
            ← Retounen
          </Link>

          <div className="privacy-hero-content">
            <span className="privacy-label">PWOFESYONÈL LAKAY</span>

            <h1>Règleman sou Konfidansyalite</h1>

            <p>
              Konfidansyalite ou enpòtan pou nou. Paj sa a esplike
              ki enfòmasyon nou ka kolekte, kijan nou itilize yo,
              kijan nou pwoteje yo, ak ki dwa ou genyen sou done ou.
            </p>

            <div className="privacy-updated">
              Dènye mizajou: Septanm 2026
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <main className="privacy-content">
        <div className="privacy-container privacy-layout">

          {/* SIDEBAR */}
          <aside className="privacy-sidebar">
            <div className="privacy-sidebar-inner">
              <span>Nan paj sa a</span>

              <a href="#entwodiksyon">Entwodiksyon</a>
              <a href="#enfomasyon">Enfòmasyon nou kolekte</a>
              <a href="#verifikasyon">Verifikasyon idantite</a>
              <a href="#itilizasyon">Kijan nou itilize done yo</a>
              <a href="#piblik">Enfòmasyon piblik ak prive</a>
              <a href="#pataje">Pataje enfòmasyon</a>
              <a href="#sekirite">Sekirite</a>
              <a href="#konsèvasyon">Konsèvasyon done</a>
              <a href="#dwa">Dwa ou</a>
              <a href="#chanjman">Chanjman nan règleman an</a>
              <a href="#kontak">Kontakte nou</a>
            </div>
          </aside>

          {/* ARTICLE */}
          <article className="privacy-article">

            <section id="entwodiksyon" className="privacy-section">
              <span className="privacy-number">01</span>

              <h2>Entwodiksyon</h2>

              <p>
                Byenveni sou Pwofesyonèl Lakay. Nou se yon platfòm
                ki fèt pou ede moun jwenn pwofesyonèl ak sèvis ki
                disponib nan zòn yo.
              </p>

              <p>
                Lè ou itilize sit entènèt oswa aplikasyon
                Pwofesyonèl Lakay, ou ka bay kèk enfòmasyon ki
                nesesè pou kreye yon kont, mete yon pwofil,
                kontakte yon pwofesyonèl oswa itilize lòt sèvis
                platfòm lan.
              </p>

              <p>
                Règleman sa a esplike fason nou trete enfòmasyon
                sa yo epi mezi nou pran pou ede pwoteje
                konfidansyalite itilizatè nou yo.
              </p>
            </section>

            <section id="enfomasyon" className="privacy-section">
              <span className="privacy-number">02</span>

              <h2>Enfòmasyon nou ka kolekte</h2>

              <p>
                Selon fason ou itilize Pwofesyonèl Lakay, nou ka
                kolekte diferan kalite enfòmasyon, tankou:
              </p>

              <div className="privacy-list-card">
                <div className="privacy-list-item">
                  <span>01</span>
                  <div>
                    <strong>Enfòmasyon pèsonèl</strong>
                    <p>
                      Non ak siyati, dat nesans, adrès imèl,
                      nimewo telefòn ak nimewo WhatsApp lè ou bay yo.
                    </p>
                  </div>
                </div>

                <div className="privacy-list-item">
                  <span>02</span>
                  <div>
                    <strong>Enfòmasyon pwofesyonèl</strong>
                    <p>
                      Metye, eksperyans, sèvis ou ofri, zòn kote
                      ou travay ak deskripsyon pwofil ou.
                    </p>
                  </div>
                </div>

                <div className="privacy-list-item">
                  <span>03</span>
                  <div>
                    <strong>Foto pwofil</strong>
                    <p>
                      Si ou chwazi mete yon foto pwofil sou kont
                      ou oswa pwofil pwofesyonèl ou.
                    </p>
                  </div>
                </div>

                <div className="privacy-list-item">
                  <span>04</span>
                  <div>
                    <strong>Evalyasyon ak kòmantè</strong>
                    <p>
                      Enfòmasyon ou bay lè ou kite yon evalyasyon
                      oswa yon kòmantè sou yon pwofesyonèl.
                    </p>
                  </div>
                </div>

                <div className="privacy-list-item">
                  <span>05</span>
                  <div>
                    <strong>Enfòmasyon pou kontak</strong>
                    <p>
                      Mesaj ak lòt enfòmasyon ou voye atravè
                      fòm kontak Pwofesyonèl Lakay.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section id="verifikasyon" className="privacy-section">
              <span className="privacy-number">03</span>

              <h2>Verifikasyon idantite</h2>

              <p>
                Pou kèk pwofesyonèl, Pwofesyonèl Lakay ka mande
                enfòmasyon ki nesesè pou verifye idantite yo.
              </p>

              <p>
                Sa ka gen ladan yon kalite dokiman idantite ak
                nimewo dokiman an, ansanm ak yon foto oswa lòt
                enfòmasyon ki nesesè pou pwosesis verifikasyon an.
              </p>

              <div className="privacy-important">
                <div className="privacy-important-icon">!</div>

                <div>
                  <strong>Enpòtan</strong>

                  <p>
                    Dokiman idantite ak enfòmasyon ki itilize pou
                    verifikasyon yo pa fèt pou parèt piblik sou
                    pwofil pwofesyonèl la. Yo itilize yo pou
                    objektif verifikasyon ak sekirite platfòm lan.
                  </p>
                </div>
              </div>
            </section>

            <section id="itilizasyon" className="privacy-section">
              <span className="privacy-number">04</span>

              <h2>Kijan nou itilize enfòmasyon yo</h2>

              <p>
                Nou itilize enfòmasyon nou kolekte yo sèlman pou
                objektif ki gen rapò ak fonksyònman Pwofesyonèl
                Lakay ak amelyorasyon sèvis nou yo.
              </p>

              <ul className="privacy-bullets">
                <li>Kreye ak jere kont itilizatè yo.</li>
                <li>
                  Kreye ak montre pwofil pwofesyonèl yo.
                </li>
                <li>
                  Ede kliyan jwenn pwofesyonèl selon sèvis ak zòn.
                </li>
                <li>
                  Pèmèt kliyan kontakte pwofesyonèl yo.
                </li>
                <li>
                  Jere evalyasyon ak kòmantè.
                </li>
                <li>
                  Verifye enfòmasyon pwofesyonèl yo lè sa nesesè.
                </li>
                <li>
                  Amelyore sekirite ak fonksyònman platfòm lan.
                </li>
                <li>
                  Reponn kesyon oswa mesaj itilizatè yo voye ba nou.
                </li>
              </ul>
            </section>

            <section id="piblik" className="privacy-section">
              <span className="privacy-number">05</span>

              <h2>Enfòmasyon piblik ak enfòmasyon prive</h2>

              <p>
                Lè ou kreye yon pwofil pwofesyonèl, kèk enfòmasyon
                ka fèt pou parèt piblik pou ede kliyan jwenn ou.
              </p>

              <div className="privacy-columns">

                <div className="privacy-box">
                  <div className="privacy-box-icon">✓</div>

                  <h3>Ka parèt piblik</h3>

                  <ul>
                    <li>Non pwofesyonèl</li>
                    <li>Metye</li>
                    <li>Zòn oswa lokalizasyon jeneral</li>
                    <li>Deskripsyon pwofil</li>
                    <li>Foto pwofil</li>
                    <li>Evalyasyon ak kòmantè</li>
                  </ul>
                </div>

                <div className="privacy-box private">
                  <div className="privacy-box-icon">🔒</div>

                  <h3>Enfòmasyon prive</h3>

                  <ul>
                    <li>Modpas kont</li>
                    <li>Dokiman idantite</li>
                    <li>Foto verifikasyon</li>
                    <li>Nimewo dokiman idantite</li>
                    <li>Lòt enfòmasyon ki pa fèt pou piblik la</li>
                  </ul>
                </div>

              </div>

              <p className="privacy-note">
                Nou konseye itilizatè yo pa mete enfòmasyon
                sansib oswa enfòmasyon pèsonèl yo pa vle piblik
                nan pati deskripsyon pwofil yo.
              </p>
            </section>

            <section id="pataje" className="privacy-section">
              <span className="privacy-number">06</span>

              <h2>Pataje enfòmasyon</h2>

              <p>
                Pwofesyonèl Lakay pa vann enfòmasyon pèsonèl
                itilizatè yo.
              </p>

              <p>
                Nan kèk ka, enfòmasyon ka trete atravè sèvis
                teknik nou itilize pou fè platfòm lan fonksyone,
                tankou sèvis otantifikasyon, baz done ak depo
                fichye.
              </p>

              <p>
                Nou ka pataje oswa divilge enfòmasyon tou lè sa
                nesesè pou respekte yon obligasyon legal, pwoteje
                sekirite platfòm lan, anpeche abi oswa pwoteje
                dwa ak sekirite itilizatè yo.
              </p>
            </section>

            <section id="sekirite" className="privacy-section">
              <span className="privacy-number">07</span>

              <h2>Sekirite enfòmasyon yo</h2>

              <p>
                Nou pran mezi teknik ak òganizasyonèl pou ede
                pwoteje enfòmasyon itilizatè yo kont aksè ki pa
                otorize, pèt, move itilizasyon oswa chanjman
                san otorizasyon.
              </p>

              <p>
                Sepandan, okenn sistèm sou entènèt pa ka garanti
                yon sekirite absoli. Se poutèt sa nou ankouraje
                itilizatè yo itilize yon modpas solid epi pa pataje
                enfòmasyon koneksyon yo ak lòt moun.
              </p>

              <div className="privacy-security-card">
                <span className="privacy-security-icon">🔐</span>

                <div>
                  <strong>Nou pran konfidansyalite oserye.</strong>
                  <p>
                    Enfòmasyon ki gen rapò ak verifikasyon idantite
                    trete kòm enfòmasyon ki pa fèt pou piblik.
                  </p>
                </div>
              </div>
            </section>

            <section id="konsèvasyon" className="privacy-section">
              <span className="privacy-number">08</span>

              <h2>Konsèvasyon done</h2>

              <p>
                Nou konsève enfòmasyon yo pandan peryòd ki nesesè
                pou bay sèvis yo, jere kont yo, fè verifikasyon,
                respekte obligasyon legal ki aplikab epi rezoud
                pwoblèm ki ka parèt.
              </p>

              <p>
                Lè yon enfòmasyon pa nesesè ankò, li ka efase,
                anonymize oswa trete selon bezwen operasyonèl ak
                obligasyon legal ki aplikab yo.
              </p>
            </section>

            <section id="dwa" className="privacy-section">
              <span className="privacy-number">09</span>

              <h2>Dwa ou sou enfòmasyon ou</h2>

              <p>
                Selon lwa ki aplikab nan peyi kote ou ye a, ou ka
                genyen kèk dwa sou enfòmasyon pèsonèl ou.
              </p>

              <ul className="privacy-bullets">
                <li>
                  Mande enfòmasyon sou fason done ou trete.
                </li>
                <li>
                  Mande koreksyon enfòmasyon ki pa egzak.
                </li>
                <li>
                  Mande efasman kèk enfòmasyon, lè sa aplikab.
                </li>
                <li>
                  Mande limit sou kèk fason yo trete enfòmasyon yo.
                </li>
                <li>
                  Poze kesyon sou done ou bay Pwofesyonèl Lakay.
                </li>
              </ul>

              <p>
                Gen kèk demann ki ka bezwen verifikasyon idantite
                moun ki fè demann lan anvan nou trete yo.
              </p>
            </section>

            <section id="chanjman" className="privacy-section">
              <span className="privacy-number">10</span>

              <h2>Chanjman nan règleman sa a</h2>

              <p>
                Nou ka mete règleman sa a ajou si sèvis Pwofesyonèl
                Lakay yo chanje, si fason nou trete enfòmasyon yo
                chanje oswa si gen nouvo obligasyon legal ki
                aplikab.
              </p>

              <p>
                Lè nou fè yon chanjman enpòtan, nou pral mete nouvo
                vèsyon an sou paj sa a epi mete dat dènye mizajou a
                ajou.
              </p>
            </section>

            <section id="kontak" className="privacy-section privacy-contact-section">
              <span className="privacy-number">11</span>

              <h2>Kontakte Pwofesyonèl Lakay</h2>

              <p>
                Si ou gen yon kesyon sou règleman sa a oswa sou
                fason enfòmasyon pèsonèl ou trete, ou ka kontakte
                ekip Pwofesyonèl Lakay.
              </p>

              <Link to="/contact" className="privacy-contact-button">
                Kontakte nou
                <span>→</span>
              </Link>
            </section>

            {/* FINAL */}
            <div className="privacy-final">
              <div className="privacy-final-logo">PL</div>

              <div>
                <strong>Pwofesyonèl Lakay</strong>

                <p>
                  Yon platfòm ki konekte moun ak pwofesyonèl
                  serye, toupre yo.
                </p>
              </div>
            </div>

          </article>
        </div>
      </main>

    </div>
  );
};

export default Privacy;
