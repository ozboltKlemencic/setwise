import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #0052D6 0%, #0063FF 50%, #3385FF 100%)',
                    borderRadius: '36px',
                }}
            >
                <span
                    style={{
                        fontSize: '100px',
                        fontWeight: 800,
                        color: 'white',
                        letterSpacing: '-0.04em',
                        marginTop: '-4px',
                    }}
                >
                    S
                </span>
            </div>
        ),
        { ...size }
    )
}
