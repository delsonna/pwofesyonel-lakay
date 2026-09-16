
import { Link } from "react-router-dom";
import "./Terms.css";

const Terms = () => {
  return (
    <div className="terms-page">

      {/* HERO */}
      <section className="terms-hero">
        <div className="terms-container">

          <Link to="/" className="terms-back">
            ← Retounen
          </Link>

          <div className="terms-hero-content">
            <span className="terms-label">
              PWOFESYONÈL LAKAY
            </span>

            <h1>Kondisyon Itilizasyon</h1>

            <p>
              Kondisyon sa yo esplike règ ak prensip ki gouvène
              itilizasyon platfòm Pwofesyonèl Lakay la. Lè ou itilize
              sèvis nou yo, ou dakò pou respekte kondisyon sa yo.
            </p>

            <div className="terms-updated">
              Dènye mizajou: Septanm 2026
            </div>
          </div>

        </div>
      </section>

      {/* CONTENT */}
      <main className="terms-content">
        <div className="terms-container terms-layout">

          {/* SIDEBAR */}
          <aside className="terms-sidebar">
            <div className="terms-sidebar-inner">

              <span>Nan paj sa a</span>

              <a href="#entwodiksyon">Entwodiksyon</a>
              <a href="#platfom">Kisa Pwofesyonèl Lakay ye</a>
              <a href="#kont">Kont itilizatè</a>
              <a href="#pwofesyonel">Responsablite pwofesyonèl yo</a>
              <a href="#kliyan">Responsablite kliyan yo</a>
              <a href="#verifikasyon">Verifikasyon</a>
              <a href="#pwofil">Pwofil ak kontni</a>
              <a href="#evalyasyon">Evalyasyon ak kòmantè</a>
              <a href="#entedi">Aktivite ki entèdi</a>
              <a href="#kominikasyon">Kominikasyon</a>
              <a href="#responsablite">Limit responsablite</a>
              <a href="#kont-sispansyon">Sispansyon kont</a>
              <a href="#pwopriyete">Pwopriyete entelektyèl</a>
              <a href="#chanjman">Chanjman</a>
              <a href="#kontak">Kontakte nou</a>

            </div>
          </aside>

          {/* ARTICLE */}
          <article className="terms-article">

            {/* 01 */}
            <section id="entwodiksyon" className="terms-section">
              <span className="terms-number">01</span>

              <h2>Entwodiksyon</h2>

              <p>
                Byenveni sou Pwofesyonèl Lakay. Lè ou antre sou sit
                entènèt nou an oswa itilize aplikasyon nou an, ou
                dakò pou respekte kondisyon itilizasyon sa yo.
              </p>

              <p>
                Si ou pa dakò ak kondisyon sa yo, tanpri pa itilize
                sèvis Pwofesyonèl Lakay yo.
              </p>

              <p>
                Kondisyon sa yo aplike pou tout moun ki itilize
                platfòm lan, kit se kliyan, pwofesyonèl oswa lòt
                itilizatè.
              </p>
            </section>

            {/* 02 */}
            <section id="platfom" className="terms-section">
              <span className="terms-number">02</span>

              <h2>Kisa Pwofesyonèl Lakay ye?</h2>

              <p>
                Pwofesyonèl Lakay se yon platfòm ki fèt pou konekte
                moun k ap chèche sèvis ak pwofesyonèl ki ofri sèvis
                sa yo.
              </p>

              <p>
                Platfòm lan pèmèt itilizatè yo chèche pwofesyonèl
                selon sèvis ak zòn, konsilte pwofil yo epi kontakte
                pwofesyonèl yo.
              </p>

              <div className="terms-important">
                <div className="terms-important-icon">i</div>

                <div>
                  <strong>Wòl Pwofesyonèl Lakay</strong>

                  <p>
                    Pwofesyonèl Lakay se yon platfòm koneksyon.
                    Nou pa nesesèman patisipe dirèkteman nan
                    akò oswa travay ki fèt ant yon kliyan ak yon
                    pwofesyonèl.
                  </p>
                </div>
              </div>
            </section>

            {/* 03 */}
            <section id="kont" className="terms-section">
              <span className="terms-number">03</span>

              <h2>Kont itilizatè</h2>

              <p>
                Pou itilize kèk fonksyon Pwofesyonèl Lakay, ou ka
                bezwen kreye yon kont.
              </p>

              <ul className="terms-bullets">
                <li>
                  Ou dwe bay enfòmasyon ki kòrèk epi ki ajou.
                </li>

                <li>
                  Ou responsab pou pwoteje enfòmasyon koneksyon
                  kont ou.
                </li>

                <li>
                  Ou pa dwe pataje modpas ou ak lòt moun.
                </li>

                <li>
                  Ou dwe notifye nou si ou remake yon aksè
                  san otorizasyon sou kont ou.
                </li>

                <li>
                  Yon moun pa dwe itilize kont yon lòt moun san
                  otorizasyon.
                </li>
              </ul>
            </section>

            {/* 04 */}
            <section id="pwofesyonel" className="terms-section">
              <span className="terms-number">04</span>

              <h2>Responsablite pwofesyonèl yo</h2>

              <p>
                Pwofesyonèl ki kreye yon pwofil sou platfòm lan
                responsab enfòmasyon yo mete sou pwofil yo.
              </p>

              <div className="terms-list-card">

                <div className="terms-list-item">
                  <span>01</span>

                  <div>
                    <strong>Enfòmasyon egzak</strong>

                    <p>
                      Bay enfòmasyon ki kòrèk sou non, metye,
                      eksperyans, sèvis ak zòn travay.
                    </p>
                  </div>
                </div>

                <div className="terms-list-item">
                  <span>02</span>

                  <div>
                    <strong>Sèvis yo ofri</strong>

                    <p>
                      Pa prezante yon sèvis ou pa kapab oswa
                      ou pa gen otorizasyon pou bay.
                    </p>
                  </div>
                </div>

                <div className="terms-list-item">
                  <span>03</span>

                  <div>
                    <strong>Konpòtman pwofesyonèl</strong>

                    <p>
                      Trete kliyan yo avèk respè epi kominike
                      yon fason pwofesyonèl.
                    </p>
                  </div>
                </div>

                <div className="terms-list-item">
                  <span>04</span>

                  <div>
                    <strong>Mete pwofil la ajou</strong>

                    <p>
                      Enfòmasyon ki sou pwofil la ta dwe rete
                      egzak ak aktyèl.
                    </p>
                  </div>
                </div>

              </div>
            </section>

            {/* 05 */}
            <section id="kliyan" className="terms-section">
              <span className="terms-number">05</span>

              <h2>Responsablite kliyan yo</h2>

              <p>
                Kliyan yo dwe itilize platfòm lan yon fason
                responsab epi respekte pwofesyonèl yo.
              </p>

              <ul className="terms-bullets">
                <li>
                  Bay enfòmasyon ki nesesè pou kominike avèk
                  pwofesyonèl la.
                </li>

                <li>
                  Pa itilize platfòm lan pou twonpe oswa twonpe
                  lòt itilizatè.
                </li>

                <li>
                  Pa voye mesaj ki menasan, ofansan oswa ilegal.
                </li>

                <li>
                  Respekte akò ki fèt dirèkteman ak pwofesyonèl la.
                </li>

                <li>
                  Bay evalyasyon ki baze sou eksperyans reyèl.
                </li>
              </ul>
            </section>

            {/* 06 */}
            <section id="verifikasyon" className="terms-section">
              <span className="terms-number">06</span>

              <h2>Verifikasyon pwofesyonèl</h2>

              <p>
                Pwofesyonèl Lakay ka mande kèk pwofesyonèl pou
                soumèt enfòmasyon oswa dokiman pou verifye
                idantite yo.
              </p>

              <p>
                Lè yon pwofesyonèl soumèt enfòmasyon pou
                verifikasyon, li dwe asire enfòmasyon yo otantik
                epi li dwe gen dwa sèvi ak dokiman yo soumèt yo.
              </p>

              <div className="terms-security">

                <span className="terms-security-icon">
                  🔐
                </span>

                <div>
                  <strong>Dokiman verifikasyon</strong>

                  <p>
                    Dokiman idantite ak enfòmasyon verifikasyon
                    yo pa fèt pou parèt kòm enfòmasyon piblik sou
                    pwofil pwofesyonèl la.
                  </p>
                </div>

              </div>
            </section>

            {/* 07 */}
            <section id="pwofil" className="terms-section">
              <span className="terms-number">07</span>

              <h2>Pwofil ak kontni</h2>

              <p>
                Itilizatè yo responsab pou kontni yo mete sou
                Pwofesyonèl Lakay.
              </p>

              <p>
                Sa gen ladan foto, deskripsyon, enfòmasyon
                pwofesyonèl, kòmantè ak lòt kontni yo soumèt.
              </p>

              <p>
                Ou pa dwe mete kontni ki fo, twonpe moun,
                ilegal, menasan, diskriminatwa oswa ki vyole
                dwa yon lòt moun.
              </p>
            </section>

            {/* 08 */}
            <section id="evalyasyon" className="terms-section">
              <span className="terms-number">08</span>

              <h2>Evalyasyon ak kòmantè</h2>

              <p>
                Evalyasyon ak kòmantè yo fèt pou ede lòt itilizatè
                konprann eksperyans kliyan yo avèk yon pwofesyonèl.
              </p>

              <p>
                Lè ou bay yon evalyasyon, li dwe baze sou yon
                eksperyans reyèl epi li pa dwe fèt pou manipile
                repitasyon yon pwofesyonèl.
              </p>

              <ul className="terms-bullets">
                <li>
                  Pa kreye fo evalyasyon.
                </li>

                <li>
                  Pa itilize evalyasyon kòm mwayen pou menase
                  oswa fè chantaj.
                </li>

                <li>
                  Pa mete enfòmasyon prive yon lòt moun nan
                  yon kòmantè.
                </li>

                <li>
                  Pa itilize langaj menasan oswa abizif.
                </li>
              </ul>
            </section>

            {/* 09 */}
            <section id="entedi" className="terms-section">
              <span className="terms-number">09</span>

              <h2>Aktivite ki entèdi</h2>

              <p>
                Pou ede kenbe yon platfòm ki serye ak an sekirite,
                itilizatè yo pa dwe itilize Pwofesyonèl Lakay pou:
              </p>

              <div className="terms-forbidden">

                <div>
                  <span>×</span>
                  <p>Aktivite ilegal oswa fwod.</p>
                </div>

                <div>
                  <span>×</span>
                  <p>Vòl oswa itilizasyon kont lòt moun.</p>
                </div>

                <div>
                  <span>×</span>
                  <p>Twòte, menas oswa arasman.</p>
                </div>

                <div>
                  <span>×</span>
                  <p>Fo enfòmasyon oswa fo idantite.</p>
                </div>

                <div>
                  <span>×</span>
                  <p>Spam oswa mesaj endezirab.</p>
                </div>

                <div>
                  <span>×</span>
                  <p>Kontni ki vyole dwa lòt moun.</p>
                </div>

              </div>
            </section>

            {/* 10 */}
            <section id="kominikasyon" className="terms-section">
              <span className="terms-number">10</span>

              <h2>Kominikasyon ant kliyan ak pwofesyonèl</h2>

              <p>
                Pwofesyonèl Lakay bay zouti ki ka pèmèt kliyan ak
                pwofesyonèl kominike.
              </p>

              <p>
                Chak pati responsab pou fason li kominike ak lòt
                pati a epi pou nenpòt akò oswa sèvis yo deside
                fè ansanm.
              </p>

              <p>
                Nou ankouraje itilizatè yo pran prekosyon lè y ap
                pataje enfòmasyon pèsonèl, finansye oswa lòt
                enfòmasyon sansib.
              </p>
            </section>

            {/* 11 */}
            <section id="responsablite" className="terms-section">
              <span className="terms-number">11</span>

              <h2>Limit responsablite</h2>

              <p>
                Pwofesyonèl Lakay fèt pou konekte kliyan ak
                pwofesyonèl. Nou pa garanti rezilta yon sèvis
                espesifik, kalite travay yon pwofesyonèl oswa
                akò ki fèt ant itilizatè yo.
              </p>

              <p>
                Itilizatè yo dwe egzamine pwofil ak enfòmasyon
                ki disponib yo epi pran pwòp desizyon yo anvan
                yo angaje yon pwofesyonèl.
              </p>

              <p>
                Lè yon kliyan ak yon pwofesyonèl dakò pou fè yon
                travay, chak pati responsab pou obligasyon ki
                soti nan akò sa a.
              </p>
            </section>

            {/* 12 */}
            <section id="kont-sispansyon" className="terms-section">
              <span className="terms-number">12</span>

              <h2>Sispansyon oswa fèmti kont</h2>

              <p>
                Pwofesyonèl Lakay ka limite, sispann oswa fèmen
                yon kont si li parèt ke itilizasyon kont lan
                vyole kondisyon sa yo, kreye risk pou lòt
                itilizatè oswa menase sekirite platfòm lan.
              </p>

              <p>
                Itilizatè yo kapab tou chwazi sispann itilize
                sèvis yo epi, lè sa aplikab, mande pou yo fèmen
                kont yo.
              </p>
            </section>

            {/* 13 */}
            <section id="pwopriyete" className="terms-section">
              <span className="terms-number">13</span>

              <h2>Pwopriyete entelektyèl</h2>

              <p>
                Non Pwofesyonèl Lakay, logo a, konsepsyon
                platfòm lan, tèks, eleman grafik ak lòt eleman
                ki fè pati sèvis la ka pwoteje pa lwa sou
                pwopriyete entelektyèl.
              </p>

              <p>
                Itilizatè yo pa dwe kopye, repwodui, modifye,
                distribye oswa itilize eleman sa yo san
                otorizasyon ki nesesè.
              </p>
            </section>

            {/* 14 */}
            <section id="chanjman" className="terms-section">
              <span className="terms-number">14</span>

              <h2>Chanjman nan kondisyon yo</h2>

              <p>
                Pwofesyonèl Lakay ka mete kondisyon itilizasyon
                sa yo ajou pou reflechi chanjman nan sèvis,
                sekirite, fonksyon platfòm lan oswa lòt bezwen
                operasyonèl ak legal.
              </p>

              <p>
                Lè gen chanjman enpòtan, nouvo vèsyon an ap
                parèt sou paj sa a ansanm ak dat dènye mizajou a.
              </p>
            </section>

            {/* 15 */}
            <section id="kontak" className="terms-section terms-contact-section">
              <span className="terms-number">15</span>

              <h2>Kontakte nou</h2>

              <p>
                Si ou gen yon kesyon sou Kondisyon Itilizasyon
                sa yo oswa sou fason Pwofesyonèl Lakay fonksyone,
                ou ka kontakte ekip nou an.
              </p>

              <Link to="/contact" className="terms-contact-button">
                Kontakte nou
                <span>→</span>
              </Link>
            </section>

            {/* FINAL BRAND */}
            <div className="terms-final">

              <div className="terms-final-logo">
                PL
              </div>

              <div>
                <strong>Pwofesyonèl Lakay</strong>

                <p>
                  Konekte ak pwofesyonèl serye, toupre ou.
                </p>
              </div>

            </div>

          </article>

        </div>
      </main>

    </div>
  );
};

export default Terms;