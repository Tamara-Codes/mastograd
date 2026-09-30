"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { ShopHeader } from "@/components/shop-header";
import { ConfigureWizard } from "@/components/configure-wizard";
import { COPY } from "@/lib/landing-copy";
import { BUNDLE_SAVING_CENTS, PRODUCT_PRICE_CENTS, priceLabelCents, productPriceLabel, type ProductId } from "@/lib/products";
import styles from "./home.module.css";

const SITE_URL = "https://www.mastograd.eu";

const sets = [
  {
    id: "alphabet" as const,
    index: "01",
    kicker: "Za prve riječi",
    name: COPY.products.cards.alphabet.name,
    description: "Od A do Ž, svako slovo postaje mala prilika za bojanje, prepoznavanje i prve poteze olovkom.",
    details: ["Slovo, riječ i sličica", "Vježba pisanja", "Ime, posveta i diploma"],
    image: "/showcase/letter-avion.png",
    imageAlt: "Listić A kao avion iz personaliziranog kompleta abecede",
    mark: "A",
  },
  {
    id: "numbers" as const,
    index: "02",
    kicker: "Za prve brojeve",
    name: COPY.products.cards.numbers.name,
    description: "Brojevi od 0 do 9 kroz velike oblike, zabavne sličice, prebrojavanje i pisanje.",
    details: ["Brojevi od 0 do 9", "Bojanje i prebrojavanje", "Ime, posveta i diploma"],
    image: "/showcase/number-1.png",
    imageAlt: "Listić jedan iz personaliziranog kompleta brojeva",
    mark: "1",
  },
];

const faq = [
  ["Za koju je dob?", "Kompleti su namijenjeni djeci koja upoznaju prva slova i brojeve, otprilike od 3 do 8 godina. Svako dijete uči svojim tempom."],
  ["Što je personalizirano?", "Poklon nosi ime djeteta, a možete dodati i svoju posvetu. U kompletu je i personalizirana diploma."],
  ["Kako naručiti?", "Odaberite abecedu, brojeve ili oba kompleta. Zatim unesite ime djeteta i ostale detalje za personalizaciju te dovršite narudžbu."],
  ["Dostavljate li izvan Hrvatske?", "Trenutačno dostavljamo unutar Hrvatske. Cijena dostave prikazuje se pri narudžbi."],
];

const productJsonLd = sets.map((set, index) => ({
  "@type": "ListItem",
  position: index + 1,
  item: {
    "@type": "Product",
    name: set.name,
    description: set.description,
    image: `${SITE_URL}${set.image}`,
    brand: { "@type": "Brand", name: "Maštograd" },
    offers: {
      "@type": "Offer",
      price: (PRODUCT_PRICE_CENTS[set.id] / 100).toFixed(2),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      areaServed: { "@type": "Country", name: "Hrvatska" },
      url: SITE_URL,
    },
  },
}));

function OrderDialog({ product, onClose }: { product: ProductId; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
      if (event.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [onClose]);

  const name = product === "bundle" ? "Oba kompleta" : COPY.products.cards[product].name;

  return createPortal(
    <div className={styles.dialogBackdrop}>
      <div ref={dialogRef} className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="order-dialog-title">
        <div className={styles.dialogHeader}>
          <div><p className={styles.eyebrow}>Vaš poklon</p><h2 id="order-dialog-title">{name} <span>{productPriceLabel(product)}</span></h2></div>
          <button ref={closeRef} type="button" className={styles.dialogClose} onClick={onClose} aria-label="Zatvorite personalizaciju">×</button>
        </div>
        <div className={styles.dialogBody}><ConfigureWizard product={product} copy={COPY} /></div>
      </div>
    </div>,
    document.body,
  );
}

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<ProductId | null>(null);

  return (
    <div className={`pastel-home ${styles.page}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "ItemList", itemListElement: productJsonLd }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) }) }} />
      <ShopHeader />

      <main>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Personalizirani pokloni za djecu</p>
            <h1>Pokloni koji spajaju <em>igru</em>, učenje i <span>maštu</span></h1>
            <p className={styles.heroLead}>Maštograd stvara personalizirane poklone za djecu koja tek upoznaju slova i brojeve — uz bojanje, prepoznavanje i prve korake u pisanju.</p>
            <div className={styles.heroActions}>
              <a href="#proizvodi" className={styles.primaryLink}>Upoznajte poklone <span aria-hidden>↗</span></a>
              <a href="#kako-radi" className={styles.textLink}>Kako nastaje poklon?</a>
            </div>
            <p className={styles.heroNote}>Personalizirano imenom <span aria-hidden>·</span> Izrađeno u Hrvatskoj</p>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.heroImageWrap}>
              <Image src="/hero-pages.jpg" alt="Personalizirani listići za bojanje i pisanje" fill priority sizes="(max-width: 850px) 100vw, 48vw" className={styles.heroImage} />
            </div>
            <div className={styles.heroSticker}>Za male ruke.<small>Za velike prve korake.</small></div>
          </div>
        </section>

        <section id="proizvodi" className={styles.products}>
          <div className={styles.sectionIntro}>
            <p className={styles.eyebrow}>Dva mala svijeta za učenje</p>
            <h2>Odaberite ono što Vaše dijete sada najviše zanima.</h2>
            <p>Slova ili brojevi? Oba kompleta možete uzeti zajedno po nižoj cijeni.</p>
          </div>

          {sets.map((set) => (
            <article key={set.id} className={`${styles.story} ${set.id === "numbers" ? styles.storyNumbers : ""}`}>
              <div className={styles.storyVisual}>
                <span className={styles.giantMark} aria-hidden>{set.mark}</span>
                <div className={styles.sheet}>
                  <Image src={set.image} alt={set.imageAlt} fill sizes="(max-width: 720px) 70vw, 330px" className={styles.sheetImage} />
                </div>
                <span className={styles.visualCaption}>Primjer listića</span>
              </div>
              <div className={styles.storyCopy}>
                <p className={styles.storyIndex}>{set.index} / {set.kicker}</p>
                <h3>{set.name}</h3>
                <p className={styles.storyDescription}>{set.description}</p>
                <ul className={styles.detailList}>
                  {set.details.map((detail) => <li key={detail}><span aria-hidden>✳</span>{detail}</li>)}
                </ul>
                <div className={styles.storyBottom}>
                  <p><strong>{productPriceLabel(set.id)}</strong><small>po kompletu</small></p>
                  <button type="button" className={styles.chooseButton} onClick={() => setSelectedProduct(set.id)}>Naručite {set.id === "alphabet" ? "abecedu" : "brojeve"} <span aria-hidden>↗</span></button>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className={styles.bundle} aria-labelledby="bundle-title">
          <div className={styles.bundleInner}>
            <div className={styles.bundleArt} aria-hidden>
              <span className={styles.bundleLetter}>A</span><span className={styles.bundlePlus}>+</span><span className={styles.bundleNumber}>1</span>
            </div>
            <div className={styles.bundleCopy}>
              <p className={styles.eyebrow}>Najljepše je zajedno</p>
              <h2 id="bundle-title">Dva poklona.<br /><em>Jedna posebna cijena.</em></h2>
              <p>Moja prva abeceda i Moji prvi brojevi, personalizirani za isto dijete. Sve za prve male korake u učenju.</p>
              <div className={styles.bundleOffer}>
                <div><span className={styles.oldPrice}>{priceLabelCents(PRODUCT_PRICE_CENTS.alphabet + PRODUCT_PRICE_CENTS.numbers)}</span><strong>{productPriceLabel("bundle")}</strong><span className={styles.saving}>Ušteda {priceLabelCents(BUNDLE_SAVING_CENTS)}</span></div>
                <button type="button" onClick={() => setSelectedProduct("bundle")}>Naručite oba kompleta <span aria-hidden>↗</span></button>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.gift} aria-labelledby="gift-title">
          <div className={styles.giftCopy}>
            <p className={styles.eyebrow}>Spremno za darivanje</p>
            <h2 id="gift-title">Poklon koji se pamti i prije prve stranice.</h2>
            <p>Osobno ime, posveta i listići za male ruke — mali svijet stvoren baš za Vaše dijete.</p>
          </div>
          <div className={styles.giftImageWrap}>
            <Image src="/showcase/photo-gift.png" alt="Gotov personalizirani poklon s imenom djeteta, spreman za darivanje" fill sizes="(max-width: 720px) 100vw, 48vw" className={styles.giftImage} />
          </div>
        </section>

        <section id="kako-radi" className={styles.how}>
          <div className={styles.howIntro}><p className={styles.eyebrow}>Jednostavno od početka do kraja</p><h2>Odaberete. Personaliziramo. Stiže za darivanje.</h2></div>
          <ol className={styles.steps}>
            <li><span>01</span><div><strong>Odaberete</strong><p>Slova, brojeve ili oba kompleta.</p></div></li>
            <li><span>02</span><div><strong>Dodate osobni detalj</strong><p>Ime djeteta i Vašu posvetu.</p></div></li>
            <li><span>03</span><div><strong>Mi izrađujemo</strong><p>Tiskamo i šaljemo poklon na adresu u Hrvatskoj.</p></div></li>
          </ol>
        </section>

        <section className={styles.faq}>
          <div><p className={styles.eyebrow}>Još ponešto</p><h2>Česta pitanja</h2></div>
          <div className={styles.faqList}>{faq.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden>+</span></summary><p>{answer}</p></details>)}</div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div><strong>Maštograd<span>.</span></strong><p>Za male ruke. Za velike prve korake.</p></div>
        <div className={styles.footerLinks}><a href="mailto:mastograd@nosastra.co">mastograd@nosastra.co</a><Link href="/privacy">Zaštita privatnosti</Link><a href="https://www.nosastra.co/" target="_blank" rel="noreferrer">Proizvod Nos Astra</a></div>
      </footer>
      {selectedProduct && <OrderDialog key={selectedProduct} product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </div>
  );
}
