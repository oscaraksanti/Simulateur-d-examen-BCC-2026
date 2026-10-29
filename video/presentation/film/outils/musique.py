"""Lit musical du film : boucle calée sur la mesure + arc dramatique calé sur la voix.

Appelé par `node outils/caler.mjs musique <piste.wav>` (ne pas lancer seul) :
    python3 -I outils/musique.py <source.wav> <sortie.wav> <fin> <ouverture> <coupure> <fin_voix>

Arc (temps en secondes dans le film) :
  0 → ouverture      accroche : la musique est étouffée (passe-bas), elle couve sous « un seul essai »
  ouverture          « Voici le Simulateur BCC » : le filtre s'ouvre d'un coup (le « drop »)
  coupure − 0,6 s    la musique se tait sous le riser…
  coupure            … et repart sur l'impact de « Passe-le cinq fois »
  fin_voix → fin     la voix s'arrête : la musique remonte, puis s'éteint sur la carte de fin
Sous la voix, le lit reste ~13 dB sous la parole (−15,5 dB ici, ≈ 0,17) : on entend chaque mot.
"""

import sys

import numpy as np
import soundfile as sf
from scipy.signal import butter, resample_poly, sosfiltfilt

SR = 48000


def tempo(x):
    """Période de battement (s) par autocorrélation de l'enveloppe d'attaques, entre 80 et 150 BPM."""
    hop = 480
    x = x.mean(axis=1)
    n = len(x) // hop
    rms = np.sqrt(np.mean(x[: n * hop].reshape(n, hop) ** 2, axis=1) + 1e-12)
    env = np.maximum(np.diff(np.log(rms)), 0)
    env -= env.mean()
    ac = np.correlate(env, env, mode="full")[len(env) - 1 :]
    fps = SR / hop
    lags = np.arange(int(fps * 60 / 150), int(fps * 60 / 80) + 1)
    lag = lags[np.argmax(ac[lags])]
    return lag / fps


def boucle(x, duree, debut=2.0, fondu=0.5):
    """Répète un passage d'un nombre entier de mesures (4 temps) avec des fondus à puissance constante."""
    p = tempo(x)
    mesure = 4 * p
    utile = len(x) / SR - debut - fondu - 0.5
    nb = max(1, int(utile // mesure))
    L, F, d = int(nb * mesure * SR), int(fondu * SR), int(debut * SR)
    morceau = x[d : d + L + F]
    sortie = morceau[:L].copy()
    t = np.linspace(0, np.pi / 2, F)[:, None]
    while len(sortie) < duree * SR + F:
        queue = morceau[L : L + F] * np.cos(t)
        suite = morceau[: L + F].copy()
        suite[:F] = suite[:F] * np.sin(t) + queue
        sortie = np.concatenate([sortie, suite[:L]])
    print(f"tempo ≈ {60 / p:.1f} BPM, boucle de {nb} mesures ({L / SR:.2f} s)")
    return sortie[: int(duree * SR)]


def rampe(points, n):
    """Courbe de gain (en dB) linéaire par morceaux, échantillonnée sur n échantillons."""
    t = np.arange(n) / SR
    xs, ys = zip(*points)
    return 10 ** (np.interp(t, xs, ys) / 20)


def main():
    source, sortie = sys.argv[1], sys.argv[2]
    fin, ouverture, coupure, fin_voix = map(float, sys.argv[3:7])
    x, sr = sf.read(source, always_2d=True)
    x = resample_poly(x, SR, sr, axis=0)
    if x.shape[1] == 1:
        x = np.repeat(x, 2, axis=1)
    lit = boucle(x, fin)
    lit /= np.sqrt(np.mean(lit**2)) / 10 ** (-16 / 20)  # ≈ −16 dB RMS avant l'arc

    # Accroche étouffée → ouverture franche sur « Voici ».
    etouffe = sosfiltfilt(butter(4, 380, "low", fs=SR, output="sos"), lit, axis=0)
    a, b = int((ouverture - 0.25) * SR), int((ouverture + 0.05) * SR)
    melange = np.zeros(len(lit))
    melange[b:] = 1
    melange[a:b] = np.sin(np.linspace(0, np.pi / 2, b - a)) ** 2
    lit = etouffe * (1 - melange[:, None]) + lit * melange[:, None]

    gain = rampe(
        [
            (0, -60), (0.06, -9), (ouverture - 0.3, -6),          # accroche : étouffée, monte doucement
            (ouverture, -14), (coupure - 0.75, -15.5),              # lit sous la voix
            (coupure - 0.6, -60), (coupure - 0.02, -60),          # silence sous le riser
            (coupure + 0.25, -15.5),                              # repart derrière l'impact
            (fin_voix + 0.1, -15.5), (fin_voix + 0.7, -8),          # la voix se tait : la musique remonte
            (fin - 2.2, -8), (fin - 0.05, -60), (fin, -60),       # puis s'éteint sur la carte de fin
        ],
        len(lit),
    )
    lit *= gain[:, None]
    crete = np.max(np.abs(lit))
    if crete > 0.89:  # ≈ −1 dBFS
        lit *= 0.89 / crete
    sf.write(sortie, lit.astype(np.float32), SR)
    print(f"lit musical : {len(lit) / SR:.2f} s → {sortie}")


if __name__ == "__main__":
    main()
