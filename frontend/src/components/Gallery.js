import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Mock gallery images - in real implementation, these would be actual photos
  const galleryImages = [
    {
      id: 1,
      title: "PlayStation Gaming Zone",
      description: "State-of-the-art PlayStation consoles with comfortable gaming chairs",
      category: "PlayStation"
    },
    {
      id: 2,
      title: "Xbox Gaming Area",
      description: "Xbox Series X/S setups with high-definition displays",
      category: "Xbox"
    },
    {
      id: 3,
      title: "Nintendo Switch Station",
      description: "Portable and docked Nintendo Switch gaming experience",
      category: "Nintendo"
    },
    {
      id: 4,
      title: "VR Gaming Experience",
      description: "Immersive virtual reality gaming with latest VR headsets",
      category: "VR"
    },
    {
      id: 5,
      title: "Board Games Collection",
      description: "Extensive collection of board games for all ages",
      category: "Board Games"
    },
    {
      id: 6,
      title: "Gaming Lounge",
      description: "Comfortable lounge area for relaxation between gaming sessions",
      category: "Lounge"
    },
    {
      id: 7,
      title: "Group Gaming Setup",
      description: "Multiple gaming stations for group competitions",
      category: "Group"
    },
    {
      id: 8,
      title: "Birthday Party Area",
      description: "Special area decorated for birthday celebrations",
      category: "Events"
    }
  ];

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const currentIndex = galleryImages.findIndex(img => img.id === selectedImage.id);
    const nextIndex = (currentIndex + 1) % galleryImages.length;
    setSelectedImage(galleryImages[nextIndex]);
  };

  const prevImage = () => {
    const currentIndex = galleryImages.findIndex(img => img.id === selectedImage.id);
    const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    setSelectedImage(galleryImages[prevIndex]);
  };

  return (
    <section id="gallery" className="py-20 px-4 bg-bg-primary">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Gaming Gallery
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Take a look at our modern gaming setup and facilities. See why gamers love spending time at Karthikeya Games Galaxy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryImages.map((image) => (
            <Card 
              key={image.id} 
              className="bg-bg-secondary border-border-subtle hover:border-accent-primary transition-all duration-300 cursor-pointer group"
              onClick={() => openModal(image)}
            >
              <CardContent className="p-0">
                <div className="aspect-square bg-gradient-to-br from-bg-tertiary to-bg-secondary flex items-center justify-center relative overflow-hidden">
                  {/* Placeholder for actual image */}
                  <div className="text-center">
                    <div className="text-4xl mb-2">📸</div>
                    <p className="text-text-secondary text-sm font-medium">{image.category}</p>
                  </div>
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-bg-primary bg-opacity-80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-center">
                      <p className="text-accent-primary font-semibold mb-1">{image.title}</p>
                      <p className="text-text-secondary text-sm px-4">{image.description}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-4xl w-full">
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 bg-bg-secondary p-2 rounded-full hover:bg-bg-tertiary transition-colors"
              >
                <X className="w-6 h-6 text-text-primary" />
              </button>

              {/* Navigation buttons */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-bg-secondary p-2 rounded-full hover:bg-bg-tertiary transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-text-primary" />
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-bg-secondary p-2 rounded-full hover:bg-bg-tertiary transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-text-primary" />
              </button>

              {/* Image content */}
              <div className="bg-bg-secondary rounded-lg p-8 text-center">
                <div className="aspect-video bg-gradient-to-br from-bg-tertiary to-bg-primary rounded-lg flex items-center justify-center mb-6">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📸</div>
                    <p className="text-text-secondary">{selectedImage.category}</p>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  {selectedImage.title}
                </h3>
                <p className="text-text-secondary">
                  {selectedImage.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;