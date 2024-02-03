import axios from 'axios';

async function domain() {
    const domains = [
        "https://force3emaa.shop/",
        "https://ce1amea1.shop/",
        "https://c1e2for3maa.shop/",
        "https://ce9m9maa.shop/",
        "https://g1hc2em13a.shop/",
        "https://sitec2e2m2a.shop/",
        "https://vce2m2m2a.shop/",
        "https://vc1em3m4a.shop/",
        "https://bc45em1ma.shop/",
        "https://bc6em2maa.shop/",
        "https://thcre1ma.shop/",
        "https://the1ce1xma.shop/",
        "https://thecexma.shop/"
    ];

    let successDomain = null;

    for (let i = 0; i < domains.length; i++) {
        try {
            const response = await axios.get(domains[i]);

            if (response.data.length > 0) {
                successDomain = domains[i];
                break;
            }
        } catch (err) {
            continue;
        }
    }
    return successDomain;
}

export default domain;
