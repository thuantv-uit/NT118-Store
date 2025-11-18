// Kiểu chữ (Text Styles)

// Text styles (tokens) cho React Native
export const typography = {
    font1: {
        fontFamily: 'Allan-Regular', // phải load font trước (xem bên dưới)
        fontSize: 32,                // số, KHÔNG dùng 'px'
        lineHeight: Math.round(32 * 1.2), // 120% -> 38
        fontWeight: '400',           // chuỗi '400' / '700'...
        fontStyle: 'normal',
        fontSpacing: 0,
    },

    bigTitle: {
        fontFamily: 'Baloo',
        fontSize: 24,
        lineHeight: Math.round(24 * 1.2),
        fontWeight: '400',
        fontStyle: 'normal',
        fontSpacing: 0,
    },
    buttonText: {
        fontFamily: 'Mali-SemiBold',
        fontSize: 20,
        lineHeight: Math.round(20 * 1.2),
        fontWeight: '600',
        fontStyle: 'normal',
        fontSpacing: 0,
    },
    calo: {
        fontFamily: 'Athiti-Light',
        fontSize: 20,
        lineHeight: Math.round(20 * 1.2),
        fontWeight: '300',
        fontStyle: 'normal',
        fontSpacing: 0,
    },


    policyDescription: {
        fontFamily: 'Bellota Text-Regular',
        fontSize: 13,
        lineHeight: Math.round(13 * 1.2),
        fontWeight: '400',
        fontStyle: 'normal',
        fontSpacing: 0,
    },
    secTitleRegu: {
        fontFamily: 'Athiti-Regular',
        fontSize: 15,
        lineHeight: Math.round(15 * 1.2),
        fontWeight: '400',
        fontStyle: 'normal',
        fontSpacing: 0,
    },
    seclectionText: {
        fontFamily: 'Bellota-Regular',
        fontSize: 15,
        lineHeight: Math.round(15 * 1.2),
        fontWeight: '400',
        fontStyle: 'normal',
        fontSpacing: 0,
    },
    selectionTitle: {
        fontFamily: 'Athiti-Medium',
        fontSize: 15,
        lineHeight: Math.round(15 * 1.2),
        fontWeight: '500',
        fontStyle: 'normal',
        fontSpacing: 0,
    },
    subText: {
        fontFamily: 'Bellota-Light',
        fontSize: 13,
        lineHeight: Math.round(13 * 1.2),
        fontWeight: '300',
        fontStyle: 'normal',
        fontSpacing: 0,
    },
    subTitle: {
        fontFamily: 'Athiti-SemiBold',
        fontSize: 20,
        lineHeight: Math.round(20 * 1.2),
        fontWeight: '600',
        fontStyle: 'normal',
        fontSpacing: 0,
    },
    subTitleRegu: {
        fontFamily: 'Athiti-Regular',
        fontSize: 20,
        lineHeight: Math.round(20 * 1.2),
        fontWeight: '400',
        fontStyle: 'normal',
        fontSpacing: 0,
    },

    subText: {
        fontFamily: 'Bellota-Light',
        fontSize: 13,
        lineHeight: Math.round(13 * 1.2),
        fontWeight: '300',
        fontStyle: 'normal',
        fontSpacing: 0,
    },
    welcome_font: {
        color: '#000000',
        fontFamily: 'Borel-Regular',
        fontSize: 24,
        fontWeight: 400,
        letterSpacing: 0,
        lineHeight: 48.8,
        textAlign: 'center',
    },



};
