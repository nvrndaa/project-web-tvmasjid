// JAM & TANGGAL
const jamEl = document.getElementById('jam');
const hariEl = document.getElementById('hari');
const tanggalEl = document.getElementById('tanggal');
const hijriEl = document.getElementById('tanggal-hijri');

setInterval(()=>{
    const now = new Date();

    jamEl.innerText = now.toLocaleTimeString('id-ID');

    hariEl.innerText = now.toLocaleDateString('id-ID',{weekday:'long'});
    tanggalEl.innerText = now.toLocaleDateString('id-ID',{
        day:'numeric',
        month:'long',
        year:'numeric'
    });

    hijriEl.innerText =
        now.toLocaleDateString('id-ID-u-ca-islamic',{
            day:'numeric',
            month:'long',
            year:'numeric'
        }) + ' H';
},1000);


// RAMADHAN (HITUNG MUNDUR)
const ramadhanTarget = new Date(2026, 1, 18); 

setInterval(() => {
    const now = new Date();
    const diff = ramadhanTarget - now;

    const days = Math.max(0, Math.ceil(diff / 86400000));
    ramadhan.innerText = days;
}, 1000);

// API SHOLAT JONGGOL
const SHOLAT_KEY = 'jadwal_sholat_jonggol';

fetch('https://api.aladhan.com/v1/timingsByCity?city=Jonggol&country=Indonesia&method=2')
.then(res => res.json())
.then(res => {
    const t = res.data.timings;

    const jadwal = {
        Fajr: t.Fajr,
        Sunrise: t.Sunrise,
        Dhuhr: t.Dhuhr,
        Asr: t.Asr,
        Maghrib: t.Maghrib,
        Isha: t.Isha
    };

    localStorage.setItem(SHOLAT_KEY, JSON.stringify(jadwal));
    tampilkanJadwal(jadwal);
})
.catch(() => {
    const saved = localStorage.getItem(SHOLAT_KEY);
    if(saved){
        tampilkanJadwal(JSON.parse(saved));
    }
});

function tampilkanJadwal(t){
    fajr.innerText = t.Fajr;
    sunrise.innerText = t.Sunrise;
    dhuhr.innerText = t.Dhuhr;
    asr.innerText = t.Asr;
    maghrib.innerText = t.Maghrib;
    isha.innerText = t.Isha;

    hitungNextSholat(t);
}

function hitungNextSholat(t){
    setInterval(()=>{
        const now = new Date();

        const list = [
            ['Subuh', t.Fajr],
            ['Dzuhur', t.Dhuhr],
            ['Ashar', t.Asr],
            ['Maghrib', t.Maghrib],
            ['Isya', t.Isha]
        ];

        let found = false;

        for(let [nama, waktu] of list){
            const [h,m] = waktu.split(':');
            const d = new Date();
            d.setHours(h,m,0,0);

            if(d > now){
                updateNext(nama, d, now);
                found = true;
                break;
            }
        }

        if(!found){
            const [h,m] = t.Fajr.split(':');
            const d = new Date();
            d.setDate(d.getDate() + 1);
            d.setHours(h,m,0,0);

            updateNext('Subuh', d, now);
        }

    },1000);
}

function updateNext(nama, target, now){
    const diff = target - now;

    nextName.innerText = nama;
    nextTime.innerText =
        String(Math.floor(diff/3600000)).padStart(2,'0') + ':' +
        String(Math.floor(diff%3600000/60000)).padStart(2,'0') + ':' +
        String(Math.floor(diff%60000/1000)).padStart(2,'0');

}