import { ImageResponse } from 'next/og'

export const alt = 'SetWise — Smart Workout Tracker'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'linear-gradient(135deg, #001133 0%, #00215C 30%, #0063FF 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Decorative circles */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-120px',
                        right: '-80px',
                        width: '400px',
                        height: '400px',
                        borderRadius: '50%',
                        background: 'rgba(51, 133, 255, 0.15)',
                        display: 'flex',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-100px',
                        left: '-60px',
                        width: '300px',
                        height: '300px',
                        borderRadius: '50%',
                        background: 'rgba(51, 133, 255, 0.1)',
                        display: 'flex',
                    }}
                />

                {/* Logo / App name */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        marginBottom: '24px',
                    }}
                >
                    <div
                        style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '16px',
                            background: 'rgba(255, 255, 255, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '32px',
                            fontWeight: 800,
                            color: 'white',
                        }}
                    >
                        S
                    </div>
                    <span
                        style={{
                            fontSize: '56px',
                            fontWeight: 800,
                            color: 'white',
                            letterSpacing: '-0.04em',
                        }}
                    >
                        SetWise
                    </span>
                </div>

                {/* Tagline */}
                <div
                    style={{
                        fontSize: '28px',
                        fontWeight: 500,
                        color: 'rgba(255, 255, 255, 0.8)',
                        letterSpacing: '-0.01em',
                        textAlign: 'center',
                        maxWidth: '700px',
                    }}
                >
                    Smart Workout Tracker for Serious Lifters
                </div>

                {/* Bottom URL */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '40px',
                        fontSize: '18px',
                        fontWeight: 500,
                        color: 'rgba(255, 255, 255, 0.5)',
                        letterSpacing: '0.05em',
                    }}
                >
                    setwise.app
                </div>
            </div>
        ),
        { ...size }
    )
}
