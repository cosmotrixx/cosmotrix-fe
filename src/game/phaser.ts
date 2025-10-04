export const getPhaser = async () => {
  if (typeof window !== 'undefined') {
    const PhaserModule = await import('phaser');
    return PhaserModule.default || PhaserModule;
  }
  return null;
};