let audioContext: AudioContext | null = null

function ctx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try {
    audioContext ??= new AudioContext()
    if (audioContext.state === 'suspended') void audioContext.resume()
    return audioContext
  } catch {
    return null
  }
}

export function playTone(frequency = 660, duration = 0.12, volume = 0.18, type: OscillatorType = 'sine') {
  const ac = ctx()
  if (!ac) return
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(frequency, ac.currentTime)
  gain.gain.setValueAtTime(volume, ac.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + duration)
  osc.connect(gain).connect(ac.destination)
  osc.start()
  osc.stop(ac.currentTime + duration)
}

export function playCountdownTick(final = false) {
  playTone(final ? 1040 : 620, final ? 0.22 : 0.09, 0.16, final ? 'triangle' : 'sine')
}

export function playShutter() {
  const ac = ctx()
  if (!ac) return
  const buffer = ac.createBuffer(1, Math.floor(ac.sampleRate * 0.09), ac.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) {
    const decay = Math.pow(1 - i / data.length, 5)
    data[i] = (Math.random() * 2 - 1) * decay
  }
  const source = ac.createBufferSource()
  source.buffer = buffer
  const filter = ac.createBiquadFilter()
  filter.type = 'highpass'
  filter.frequency.value = 900
  const gain = ac.createGain()
  gain.gain.value = 0.35
  source.connect(filter).connect(gain).connect(ac.destination)
  source.start()
  playTone(1500, 0.05, 0.08, 'square')
}

export function playSuccess() {
  playTone(880, 0.1, 0.14, 'sine')
  window.setTimeout(() => playTone(1320, 0.18, 0.12, 'sine'), 90)
}
