import React from 'react';
export default function SliderComponent() {
  return (
    <section className="slider-element min-vh-100 dark include-header mainpage">
      <div className="slider-inner">
        <div className="container">
          <div className="slider-caption slider-caption-center">
            <h2 data-animate="fadeInDown">Hochhuth Consulting GmbH</h2>
            <p className="" data-animate="fadeInUp" data-delay="100">
              Making SDGs work - Smart Digital Governance Solutions
            </p>
          </div>
        </div>
        <div className="bg-overlay-bg op-05"></div>
      </div>
    </section>
  );
}
