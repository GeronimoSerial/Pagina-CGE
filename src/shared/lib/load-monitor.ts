// Monitor de carga del sistema para optimizar rendimiento
class LoadMonitor {
  private samples: number[] = [];
  private maxSamples = 10;
  
  recordResponse(duration: number): void {
    this.samples.push(duration);
    if (this.samples.length > this.maxSamples) {
      this.samples.shift();
    }
  }
  
  getAverageResponseTime(): number {
    if (this.samples.length === 0) return 0;
    return this.samples.reduce((a, b) => a + b, 0) / this.samples.length;
  }
  
  isHighLoad(): boolean {
    return this.getAverageResponseTime() > 2000; // 2 segundos
  }
  
  getLoadLevel(): 'low' | 'medium' | 'high' {
    const avg = this.getAverageResponseTime();
    if (avg < 500) return 'low';
    if (avg < 1500) return 'medium';
    return 'high';
  }
  
  getStats() {
    return {
      averageResponseTime: this.getAverageResponseTime(),
      sampleCount: this.samples.length,
      loadLevel: this.getLoadLevel(),
      isHighLoad: this.isHighLoad()
    };
  }
  
  getMetrics() {
    return this.getStats();
  }
  
  getLoadReport() {
    return this.getStats();
  }
  
  reset() {
    this.samples = [];
  }
}

export const loadMonitor = new LoadMonitor();
