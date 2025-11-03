import React from 'react';
import './App.css';

/**
 * PUBLIC_INTERFACE
 * SignIn component renders a static approximation of the provided Figma sign-in screen.
 * It uses assets placed under /assets and is optimized for performance in dev.
 */
function SignIn() {
  return (
    <div className="App" style={{ background: 'var(--style-10-background-color)' }}>
      <header className="App-header" style={{ minHeight: 'auto' }}>
        <div
          id="screen-sign-in-11-235"
          style={{
            backgroundColor: 'var(--style-10-background-color)',
            width: 375,
            height: 812,
            position: 'relative',
            overflow: 'hidden',
          }}
          aria-label="Sign In Screen"
        >
          <div style={{ position: 'absolute', left: 30, top: 94, width: 155, height: 75 }}>
            <div
              style={{
                position: 'absolute',
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
                textAlign: 'left',
              }}
            >
              Hello,
            </div>
            <div
              style={{
                position: 'absolute',
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
                textAlign: 'left',
              }}
            >
              Welcome Back!
            </div>
          </div>

          <div style={{ position: 'absolute', left: 30, top: 226, width: 315, height: 81 }}>
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: 200,
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
              style={{
                position: 'absolute',
                left: 0,
                top: 26,
                width: 315,
                height: 55,
                border: '1.5px solid var(--style-30-border-color)',
                borderRadius: 10,
                background: 'transparent',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 20,
                top: 45,
                width: 200,
                height: 17,
                color: 'var(--typo-65-color)',
                fontFamily: 'Poppins, sans-serif',
                fontSize: 11,
                fontWeight: 400,
                lineHeight: '16.5px',
                letterSpacing: 0,
                textAlign: 'left',
              }}
            >
              Enter Email
            </div>
          </div>

          <div style={{ position: 'absolute', left: 30, top: 337, width: 315, height: 81 }}>
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: 200,
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
              style={{
                position: 'absolute',
                left: 0,
                top: 26,
                width: 315,
                height: 55,
                border: '1.5px solid var(--style-30-border-color)',
                borderRadius: 10,
                background: 'transparent',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 20,
                top: 45,
                width: 200,
                height: 17,
                color: 'var(--typo-65-color)',
                fontFamily: 'Poppins, sans-serif',
                fontSize: 11,
                fontWeight: 400,
                lineHeight: '16.5px',
                letterSpacing: 0,
                textAlign: 'left',
              }}
            >
              Enter Password
            </div>
          </div>

          <div style={{ position: 'absolute', left: 40, top: 438, width: 200, height: 17 }}>
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: 200,
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

          <button
            id="bigbtn-54-668"
            type="button"
            style={{
              position: 'absolute',
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
              color: 'var(--typo-58-color)',
              fontFamily: 'Poppins, sans-serif',
              fontSize: 16,
              fontWeight: 600,
              lineHeight: '24px',
              transition: 'filter 0.15s ease, transform 0.05s ease',
            }}
            onClick={(e) => {
              const btn = e.currentTarget;
              btn.style.transform = 'scale(0.99)';
              setTimeout(() => (btn.style.transform = ''), 120);
              // placeholder interaction
              // eslint-disable-next-line no-console
              console.log('[SignIn] Sign In clicked');
            }}
            aria-label="Sign In"
          >
            <span>Sign In</span>
            <img
              alt="Arrow Right"
              src="/assets/figma_image_30_781.png"
              style={{ width: 20, height: 20 }}
            />
          </button>

          <div style={{ position: 'absolute', left: 90, top: 560, width: 195, height: 17 }}>
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 9,
                width: 50,
                height: 0,
                borderTop: '1px solid var(--style-28-border-color)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 57,
                top: 0,
                width: 120,
                height: 17,
                color: 'var(--typo-64-color)',
                fontFamily: 'Poppins, sans-serif',
                fontSize: 11,
                fontWeight: 500,
                lineHeight: '16.5px',
                letterSpacing: 0,
                textAlign: 'left',
              }}
            >
              Or Sign in With
            </div>
            <div
              style={{
                position: 'absolute',
                left: 145,
                top: 9,
                width: 50,
                height: 0,
                borderTop: '1px solid var(--style-28-border-color)',
              }}
            />
          </div>

          <div style={{ position: 'absolute', left: 131, top: 597, width: 44, height: 44 }}>
            <div
              style={{
                position: 'absolute',
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
              style={{ position: 'absolute', left: 12, top: 12, width: 20, height: 20 }}
            />
          </div>

          <div style={{ position: 'absolute', left: 200, top: 597, width: 44, height: 44 }}>
            <div
              style={{
                position: 'absolute',
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
              style={{ position: 'absolute', left: 12, top: 12, width: 20, height: 20 }}
            />
          </div>

          <div
            style={{
              position: 'absolute',
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

          <img
            alt="Battery"
            src="/assets/figma_image_36_832.png"
            style={{ position: 'absolute', left: 336, top: 16, width: 24, height: 12 }}
          />

          <div style={{ position: 'absolute', left: 0, top: 778, width: 375, height: 34 }}>
            <div
              style={{
                position: 'absolute',
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
