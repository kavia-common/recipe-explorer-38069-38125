import React, { useCallback } from 'react';
import './App.css';

/**
 * PUBLIC_INTERFACE
 * SignIn component renders the Figma-extracted Sign In screen (11-235) with pixel-perfect parity.
 * It references the root-level assets for CSS variables and images, mirroring interactions from sign-in-11-235.js.
 */
function SignIn() {
  // PUBLIC_INTERFACE
  const handleSignInClick = useCallback((e) => {
    const btn = e.currentTarget;
    // Mirror feedback from assets/sign-in-11-235.js
    btn.style.transform = 'scale(0.99)';
    setTimeout(() => {
      btn.style.transform = '';
    }, 120);
    // eslint-disable-next-line no-console
    console.log('[sign-in-11-235] Sign In clicked');
  }, []);

  return (
    <div className="App" style={{ background: 'var(--style-10-background-color)' }}>
      <header className="App-header" style={{ minHeight: 'auto' }}>
        {/* Root screen container (375x812 per Figma) */}
        <div
          id="screen-sign-in-11-235"
          className="figma-screen"
          style={{
            width: 375,
            height: 812,
            background: 'var(--style-10-background-color)',
            position: 'relative',
            overflow: 'hidden',
          }}
          aria-label="Sign In Screen"
          role="region"
        >
          {/* Title Group at left:30, top:94 */}
          <div className="figma-abs" style={{ left: 30, top: 94, width: 155, height: 75 }}>
            {/* Hello, */}
            <div
              className="figma-abs"
              style={{
                left: 0,
                top: 0,
                width: 84,
                height: 45,
                background: 'var(--style-3-background-color)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                fontFamily: 'Poppins, sans-serif',
                fontSize: 30,
                fontWeight: 600,
                lineHeight: '45px',
                letterSpacing: 0,
                textAlign: 'left',
              }}
            >
              Hello,
            </div>
            {/* Welcome Back! */}
            <div
              className="figma-abs"
              style={{
                left: 0,
                top: 45,
                width: 155,
                height: 30,
                background: 'var(--style-18-background-color)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                fontFamily: 'Poppins, sans-serif',
                fontSize: 20,
                fontWeight: 400,
                lineHeight: '30px',
                letterSpacing: 0,
                textAlign: 'left',
              }}
            >
              Welcome Back!
            </div>
          </div>

          {/* Input Email */}
          <div className="figma-abs" style={{ left: 30, top: 226, width: 315, height: 81 }}>
            <div
              className="figma-abs"
              style={{
                left: 0,
                top: 0,
                width: 38,
                height: 21,
                color: 'var(--typo-66-color)',
                fontFamily: 'Poppins, sans-serif',
                fontSize: 14,
                fontWeight: 400,
                lineHeight: '21px',
                letterSpacing: 0,
                textAlign: 'left',
              }}
            >
              Email
            </div>
            <div
              id="rect-30-585"
              className="figma-abs"
              style={{
                left: 0,
                top: 26,
                width: 315,
                height: 55,
                border: '1.5px solid var(--style-30-border-color)',
                borderRadius: 10,
                background: 'transparent',
                boxSizing: 'border-box',
              }}
            />
            <div
              id="ph-30-585"
              className="figma-abs"
              style={{
                left: 20,
                top: 45,
                width: 61,
                height: 17,
                color: 'var(--typo-65-color)',
                fontFamily: 'Poppins, sans-serif',
                fontSize: 11,
                fontWeight: 400,
                lineHeight: '16.5px',
                letterSpacing: 0,
                textAlign: 'left',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            >
              Enter Email
            </div>
          </div>

          {/* Input Password */}
          <div className="figma-abs" style={{ left: 30, top: 337, width: 315, height: 81 }}>
            <div
              className="figma-abs"
              style={{
                left: 0,
                top: 0,
                width: 107,
                height: 21,
                color: 'var(--typo-66-color)',
                fontFamily: 'Poppins, sans-serif',
                fontSize: 14,
                fontWeight: 400,
                lineHeight: '21px',
                letterSpacing: 0,
                textAlign: 'left',
              }}
            >
              Enter Password
            </div>
            <div
              id="rect-30-590"
              className="figma-abs"
              style={{
                left: 0,
                top: 26,
                width: 315,
                height: 55,
                border: '1.5px solid var(--style-30-border-color)',
                borderRadius: 10,
                background: 'transparent',
                boxSizing: 'border-box',
              }}
            />
            <div
              id="ph-30-590"
              className="figma-abs"
              style={{
                left: 20,
                top: 45,
                width: 84,
                height: 17,
                color: 'var(--typo-65-color)',
                fontFamily: 'Poppins, sans-serif',
                fontSize: 11,
                fontWeight: 400,
                lineHeight: '16.5px',
                letterSpacing: 0,
                textAlign: 'left',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            >
              Enter Password
            </div>
          </div>

          {/* Forgot Password */}
          <div className="figma-abs" style={{ left: 40, top: 438, width: 97, height: 17 }}>
            <div
              className="figma-abs"
              style={{
                left: 0,
                top: 0,
                width: 97,
                height: 17,
                color: 'var(--typo-62-color)',
                fontFamily: 'Poppins, sans-serif',
                fontSize: 11,
                fontWeight: 400,
                lineHeight: '16.5px',
                textAlign: 'center',
                letterSpacing: 0,
              }}
            >
              Forgot Password?
            </div>
          </div>

          {/* Sign In Button */}
          <button
            id="bigbtn-54-668"
            data-role="sign-in-btn"
            type="button"
            className="figma-abs"
            style={{
              left: 30,
              top: 480,
              width: 315,
              height: 60,
              background: 'var(--style-11-background-color)',
              border: 'none',
              borderRadius: 10,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              cursor: 'pointer',
              transition: 'filter 0.15s ease, transform 0.05s ease',
            }}
            onClick={handleSignInClick}
            aria-label="Sign In"
          >
            <span
              className="btn-label"
              style={{
                color: 'var(--typo-58-color)',
                fontFamily: 'Poppins, sans-serif',
                fontSize: 16,
                fontWeight: 600,
                lineHeight: '24px',
                letterSpacing: 0,
                textAlign: 'center',
              }}
            >
              Sign In
            </span>
            <img
              alt="Arrow Right"
              src="/assets/figma_image_30_781.png"
              style={{ width: 20, height: 20 }}
            />
          </button>

          {/* Separator lines + text */}
          <div id="line-group-12-139" className="figma-abs" style={{ left: 90, top: 560, width: 195, height: 17 }}>
            <div className="figma-abs" style={{ left: 0, top: 9, width: 50, height: 0, borderTop: '1px solid var(--style-28-border-color)', opacity: 0.9 }} />
            <div
              className="figma-abs"
              style={{
                left: 57,
                top: 0,
                width: 81,
                height: 17,
                color: 'var(--typo-64-color)',
                fontFamily: 'Poppins, sans-serif',
                fontSize: 11,
                fontWeight: 500,
                lineHeight: '16.5px',
                letterSpacing: 0,
                textAlign: 'left',
                opacity: 0.9,
              }}
            >
              Or Sign in With
            </div>
            <div className="figma-abs" style={{ left: 145, top: 9, width: 50, height: 0, borderTop: '1px solid var(--style-28-border-color)', opacity: 0.9 }} />
          </div>

          {/* Social Buttons */}
          <div className="figma-abs" style={{ left: 131, top: 597, width: 44, height: 44 }}>
            <div
              className="figma-abs"
              style={{
                left: 0,
                top: 0,
                width: 44,
                height: 44,
                background: 'var(--style-126-background-color)',
                borderRadius: 10,
                boxShadow: '0 8px 25px 0 #202020',
              }}
            />
            <img
              alt="Google Icon"
              src="/assets/figma_image_30_811.png"
              className="figma-abs"
              style={{ left: 12, top: 12, width: 20, height: 20 }}
            />
          </div>

          <div className="figma-abs" style={{ left: 200, top: 597, width: 44, height: 44 }}>
            <div
              className="figma-abs"
              style={{
                left: 0,
                top: 0,
                width: 44,
                height: 44,
                background: 'var(--style-126-background-color)',
                borderRadius: 10,
                boxShadow: '0 8px 25px 0 #202020',
              }}
            />
            <img
              alt="Facebook Icon"
              src="/assets/figma_image_30_841.png"
              className="figma-abs"
              style={{ left: 12, top: 12, width: 20, height: 20 }}
            />
          </div>

          {/* Sign up text */}
          <div
            className="figma-abs"
            style={{
              left: 99,
              top: 696,
              width: 177,
              height: 17,
              color: 'var(--typo-63-color)',
              fontFamily: 'Poppins, sans-serif',
              fontSize: 11,
              fontWeight: 500,
              lineHeight: '16.5px',
              letterSpacing: 0,
              textAlign: 'left',
            }}
          >
            Don’t have an account? Sign up
          </div>

          {/* Status bar icons */}
          <img
            alt="Battery"
            src="/assets/figma_image_36_832.png"
            className="figma-abs"
            style={{ left: 336, top: 16, width: 24, height: 12 }}
          />

          {/* Home indicator */}
          <div className="figma-abs" style={{ left: 0, top: 778, width: 375, height: 34 }}>
            <div
              className="figma-abs"
              style={{
                left: 120,
                top: 21,
                width: 135,
                height: 5,
                background: 'var(--style-32-background-color)',
                borderRadius: 100,
              }}
            />
          </div>
        </div>
      </header>
    </div>
  );
}

export default SignIn;
