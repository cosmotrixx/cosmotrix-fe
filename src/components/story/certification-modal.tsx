'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Download, Share2, Trophy, Star, Edit3, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getStoredProgress, saveUserName } from '@/lib/story-progress';

interface CertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CertificationModal({ isOpen, onClose }: CertificationModalProps) {
  const [progress, setProgress] = useState(getStoredProgress());
  const [showConfetti, setShowConfetti] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const currentProgress = getStoredProgress();
      console.log('Modal opened, current progress:', currentProgress);
      setProgress(currentProgress);
      
      // In development mode, force certification to true for testing
      if (process.env.NODE_ENV === 'development') {
        setProgress(prev => ({ ...prev, isCertified: true }));
      }
      
      if (currentProgress.isCertified || process.env.NODE_ENV === 'development') {
        setShowConfetti(true);
        const timer = setTimeout(() => setShowConfetti(false), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (progress.userName) {
      setNameInput(progress.userName);
    }
  }, [progress.userName]);

  // In development mode, show modal even if not certified
  if (!isOpen || (!progress.isCertified && process.env.NODE_ENV !== 'development')) {
    return null;
  }

  const certificationDate = progress.certificationDate 
    ? new Date(progress.certificationDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Today';

  const handleSaveName = async () => {
    if (nameInput.trim()) {
      // Save the name first
      saveUserName(nameInput.trim());
      
      // Update local state immediately
      const updatedProgress = { ...progress, userName: nameInput.trim() };
      setProgress(updatedProgress);
      setShowNameInput(false);
      
      // Generate PDF with the saved name
      await generateCertificatePDF(nameInput.trim());
    }
  };

  const generateCertificatePDF = async (userName?: string) => {
    setIsGeneratingPDF(true);
    
    try {
      // Get the most current progress and use provided userName or fallback to stored userName
      const currentProgress = getStoredProgress();
      const finalUserName = userName || currentProgress.userName || progress.userName || 'Solar Sentinel Graduate';
      
      console.log('Generating PNG for user:', finalUserName);
      
      // Create a canvas to render the certificate
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set canvas dimensions
      canvas.width = 800;
      canvas.height = 600;
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      // Load the certificate template image
      const templateImage = new Image();
      templateImage.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        templateImage.onload = () => {
          // Draw the background image
          ctx.drawImage(templateImage, 0, 0, canvas.width, canvas.height);
          
          // Configure text styling for the username
          ctx.font = 'bold 32px "Times New Roman", serif';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          // Add text shadow
          ctx.shadowColor = 'rgba(0,0,0,0.5)';
          ctx.shadowBlur = 4;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
          
          // Draw the username (centered, slightly below middle)
          ctx.fillText(finalUserName, canvas.width / 2, canvas.height / 2 + 20);
          
          // Reset shadow for additional info
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          
          // Add subtle shadow for additional info
          ctx.shadowColor = 'rgba(0,0,0,0.5)';
          ctx.shadowBlur = 2;
          ctx.shadowOffsetX = 1;
          ctx.shadowOffsetY = 1;
          
          // Configure text styling for additional info
          ctx.font = '14px "Times New Roman", serif';
          ctx.fillStyle = '#ffffff';
          
          // Draw additional info
          const additionalInfo = `Completed on ${certificationDate}`;
          const certificateId = `Certificate ID: SS-${Date.now()}`;
          
          ctx.fillText(additionalInfo, canvas.width / 2, canvas.height - 120);
          ctx.fillText(certificateId, canvas.width / 2, canvas.height - 100);
          
          resolve(true);
        };
        
        templateImage.onerror = () => {
          // If image fails to load, create a basic certificate
          console.warn('Certificate template image failed to load, creating basic certificate');
          
          // Create gradient background
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          gradient.addColorStop(0, '#1f2937');
          gradient.addColorStop(0.5, '#374151');
          gradient.addColorStop(1, '#1f2937');
          
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Add border
          ctx.strokeStyle = '#f97316';
          ctx.lineWidth = 8;
          ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
          
          // Add title
          ctx.font = 'bold 36px "Times New Roman", serif';
          ctx.fillStyle = '#f97316';
          ctx.textAlign = 'center';
          ctx.fillText('SOLAR SENTINEL', canvas.width / 2, 100);
          ctx.fillText('CERTIFICATE', canvas.width / 2, 150);
          
          // Add username
          ctx.font = 'bold 32px "Times New Roman", serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText(finalUserName, canvas.width / 2, canvas.height / 2 + 20);
          
          // Add additional info
          ctx.font = '16px "Times New Roman", serif';
          ctx.fillStyle = '#d1d5db';
          ctx.fillText(`Completed on ${certificationDate}`, canvas.width / 2, canvas.height - 120);
          ctx.fillText(`Certificate ID: SS-${Date.now()}`, canvas.width / 2, canvas.height - 90);
          
          resolve(true);
        };
        
        // Try to load the template image
        templateImage.src = '/images/certificate-template.png';
      });
      
      // Convert canvas to blob and download
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('Could not create image blob');
        }
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `solar-sentinel-certificate-${finalUserName.replace(/\s+/g, '-').toLowerCase()}.png`;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        URL.revokeObjectURL(url);
        
      }, 'image/png', 1.0);
      
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Error generating certificate. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleDownload = async () => {
    console.log('HandleDownload called, progress.userName:', progress.userName);
    
    // Get the most current progress to ensure we have the latest userName
    const currentProgress = getStoredProgress();
    
    if (!currentProgress.userName && !progress.userName) {
      console.log('No userName found, showing name input');
      setShowNameInput(true);
      return;
    }
    
    console.log('UserName exists, generating PDF');
    await generateCertificatePDF(currentProgress.userName || progress.userName);
  };

  const handleShare = () => {
    const userName = progress.userName || 'someone';
    const shareText = `🏆 ${userName} just became a certified Solar Sentinel! I completed the Cosmotrix story and earned my Space Weather Guardian certification!`;
    
    if (navigator.share) {
      navigator.share({
        title: 'I became a Solar Sentinel!',
        text: shareText,
        url: window.location.origin
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(
        `${shareText} Check out the Cosmotrix story at ${window.location.origin}`
      );
      alert('Achievement copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-orange-300/30 rounded-3xl p-8 max-w-2xl w-full text-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-yellow-400/20" />
          <div className="absolute top-4 left-4 w-32 h-32 border border-orange-300/30 rounded-full" />
          <div className="absolute bottom-4 right-4 w-24 h-24 border border-yellow-300/30 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-orange-300/20 rounded-full" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-yellow-400 rounded-full flex items-center justify-center shadow-2xl">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-2">Congratulations!</h2>
            <p className="text-xl text-orange-200">You are now a certified Solar Sentinel</p>
          </div>

          {/* Certificate */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-orange-300/30 rounded-2xl p-8 mb-8">
            <div className="border-4 border-orange-300/50 rounded-xl p-6">
              <div className="text-orange-400 text-sm font-semibold mb-2">SPACE WEATHER GUARDIAN</div>
              <h3 className="text-2xl font-bold text-white mb-4">OFFICIAL CERTIFICATION</h3>
              
              <div className="text-gray-300 mb-6">
                <p className="mb-2">This certifies that</p>
                
                {/* Name Display/Input */}
                <div className="my-4">
                  {progress.userName ? (
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-2xl font-bold text-orange-300">{progress.userName}</span>
                      <button
                        onClick={() => setShowNameInput(true)}
                        className="p-1 text-orange-400 hover:text-orange-300 transition-colors"
                        title="Edit name"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-xl font-semibold text-orange-300 italic">
                      [Click "Create Certificate" to add your name]
                    </div>
                  )}
                </div>
                
                <p className="mb-2">has successfully completed</p>
                <p className="text-xl font-semibold text-orange-300 mb-2">The Cosmotrix Story Experience</p>
                <p>and demonstrated mastery of space weather phenomena</p>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-400 border-t border-orange-300/30 pt-4">
                <div>
                  <div>Certification Date</div>
                  <div className="text-orange-300 font-semibold">{certificationDate}</div>
                </div>
                <div className="text-right">
                  <div>Chapters Completed</div>
                  <div className="text-orange-300 font-semibold">{progress.completedChapters.length}/3</div>
                </div>
              </div>
            </div>
          </div>

          {/* Name Input Modal */}
          {showNameInput && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
              <div className="bg-gray-800 border border-orange-300/30 rounded-xl p-6 max-w-md w-full mx-4">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-orange-400" />
                  Enter Your Name for Certificate
                </h4>
                
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-400 focus:outline-none mb-4"
                  autoFocus
                  onKeyPress={(e) => e.key === 'Enter' && handleSaveName()}
                />
                
                <div className="flex gap-3">
                  <button
                    onClick={handleSaveName}
                    disabled={!nameInput.trim()}
                    className="flex-1 py-2 px-4 bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
                  >
                    Save & Generate Certificate
                  </button>
                  <button
                    onClick={() => setShowNameInput(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

       

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleDownload}
              disabled={isGeneratingPDF}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
            >
              {isGeneratingPDF ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Generating Image...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  {(progress.userName || getStoredProgress().userName) ? 'Download Certificate' : 'Create Certificate'}
                </>
              )}
            </button>
            
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold rounded-lg transition-all duration-300"
            >
              <Share2 className="w-5 h-5" />
              Share Achievement
            </button>
          </div>

          {/* Game CTA */}
          <div className="mt-8 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-lg">
            <p className="text-purple-200 mb-3">🎮 Your certification unlocks exclusive game content!</p>
            <a
              href="/game"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all duration-300"
            >
              Play Bonus Game
              <span>→</span>
            </a>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}