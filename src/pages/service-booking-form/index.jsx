import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import { useSelector } from 'react-redux';
import { showError, showSuccess } from '../../features/notifications/notificationsSlice';
import { useDispatch } from 'react-redux';

import ServiceTypeSelector from './components/ServiceTypeSelector';
import ServiceDetailsForm from './components/ServiceDetailsForm';
import DateTimeSelector from './components/DateTimeSelector';
import LocationForm from './components/LocationForm';
import TechnicianSelector from './components/TechnicianSelector';
import PriceEstimation from './components/PriceEstimation';
import FileUpload from './components/FileUpload';
import ProgressIndicator from './components/ProgressIndicator';
import { getServices } from '../../utils/api';

const ServiceBookingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [selectedService, setSelectedService] = useState(null);
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [address, setAddress] = useState('');
  const [instructions, setInstructions] = useState('');
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [autoMatch, setAutoMatch] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Services from backend (mapped to form needs)
  const [services, setServices] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getServices();
        const iconFor = (name) => {
          const n = (name || '').toLowerCase();
          if (n.includes('plumb')) return 'Wrench';
          if (n.includes('elect')) return 'Zap';
          if (n.includes('carp')) return 'Hammer';
          return 'Tool';
        };
        const mapped = (data || []).map(s => ({
          id: s.id,
          name: s.name,
          description: s.description,
          icon: iconFor(s.name),
          basePrice: Number(s.priceFrom || 0),
        }));
        setServices(mapped);
      } catch (e) {
        setServices([]);
      }
    })();
  }, []);

  // Technicians from backend (verified)
  const [technicians, setTechnicians] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { getTechnicians } = await import('../../utils/api');
        const data = await getTechnicians({ status: 'verified' });
        const mapped = (data || []).map(t => ({
          id: t.id,
          name: t.name,
          avatar: '',
          rating: t.rating,
          reviewCount: 0,
          hourlyRate: 0,
          experience: 0,
          distance: 0,
          isAvailable: true,
          specialties: [t.service]
        }));
        setTechnicians(mapped);
      } catch (e) {
        setTechnicians([]);
      }
    })();
  }, []);

  const availableSlots = [
    '2025-01-07_09:00', '2025-01-07_10:00', '2025-01-07_14:00',
    '2025-01-08_08:00', '2025-01-08_11:00', '2025-01-08_15:00',
    '2025-01-09_09:00', '2025-01-09_13:00', '2025-01-09_16:00'
  ];

  const steps = [
    { id: 1, title: 'Service Type', description: 'Select service' },
    { id: 2, title: 'Details', description: 'Describe needs' },
    { id: 3, title: 'Schedule', description: 'Pick date & time' },
    { id: 4, title: 'Location', description: 'Service address' },
    { id: 5, title: 'Technician', description: 'Choose provider' },
    { id: 6, title: 'Review', description: 'Confirm booking' }
  ];

  // Pre-fill service if coming from category selection
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const serviceType = params?.get('service');
    if (serviceType && services?.length) {
      const service = services?.find(s => s?.id === serviceType || s?.name?.toLowerCase() === serviceType?.toLowerCase());
      if (service) {
        setSelectedService(service);
      }
    }
  }, [location?.search, services]);

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return selectedService !== null;
      case 2:
        return description?.trim() && urgency && estimatedDuration;
      case 3:
        return selectedDate && selectedTime;
      case 4:
        return address?.trim();
      case 5:
        return autoMatch || selectedTechnician !== null;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps?.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleStepClick = (step) => {
    if (step <= currentStep || validateStep(step - 1)) {
      setCurrentStep(step);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    if (!user?.id) {
      navigate('/user-login', { state: { message: 'Please log in to place a booking.' } });
      return;
    }

    try {
      setIsSubmitting(true);
      const iso = `${selectedDate}T${selectedTime}:00`;
      const { createBooking } = await import('../../utils/api');
      const created = await createBooking({
        serviceId: selectedService?.id,
        date: iso,
        location: address,
        customerId: user.id,
        technicianId: autoMatch ? null : selectedTechnician?.id || null,
      });
      dispatch(showSuccess('Booking requested successfully'));
      navigate(`/booking-success/${created.id}`);
    } catch (e) {
      const msg = e?.response?.data?.message || 'Failed to submit booking. Please try again.';
      dispatch(showError(msg));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    // Save to localStorage
    const draftData = {
      selectedService,
      description,
      urgency,
      estimatedDuration,
      selectedDate,
      selectedTime,
      address,
      instructions,
      selectedTechnician,
      autoMatch,
      currentStep
    };
    localStorage.setItem('serviceBookingDraft', JSON.stringify(draftData));
    
    // Show success message or navigate
    navigate('/customer-dashboard', { 
      state: { message: 'Booking draft saved successfully' }
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ServiceTypeSelector
            selectedService={selectedService}
            onServiceSelect={setSelectedService}
            services={services}
          />
        );
      case 2:
        return (
          <ServiceDetailsForm
            description={description}
            onDescriptionChange={setDescription}
            urgency={urgency}
            onUrgencyChange={setUrgency}
            estimatedDuration={estimatedDuration}
            onDurationChange={setEstimatedDuration}
          />
        );
      case 3:
        return (
          <DateTimeSelector
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            selectedTime={selectedTime}
            onTimeChange={setSelectedTime}
            availableSlots={availableSlots}
          />
        );
      case 4:
        return (
          <LocationForm
            address={address}
            onAddressChange={setAddress}
            instructions={instructions}
            onInstructionsChange={setInstructions}
          />
        );
      case 5:
        return (
          <TechnicianSelector
            technicians={technicians}
            selectedTechnician={selectedTechnician}
            onTechnicianSelect={setSelectedTechnician}
            autoMatch={autoMatch}
            onAutoMatchToggle={setAutoMatch}
          />
        );
      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Review & Confirm</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                {/* Service Summary */}
                <div className="bg-card border border-border rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-3">Service Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service:</span>
                      <span className="text-foreground">{selectedService?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="text-foreground">{estimatedDuration} hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Urgency:</span>
                      <span className="text-foreground capitalize">{urgency}</span>
                    </div>
                  </div>
                </div>

                {/* Schedule Summary */}
                <div className="bg-card border border-border rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-3">Schedule</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="text-foreground">
                        {new Date(selectedDate)?.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span className="text-foreground">{selectedTime}</span>
                    </div>
                  </div>
                </div>

                {/* Location Summary */}
                <div className="bg-card border border-border rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-3">Location</h4>
                  <p className="text-sm text-foreground">{address}</p>
                  {instructions && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Instructions: {instructions}
                    </p>
                  )}
                </div>

                {/* File Upload */}
                <FileUpload
                  files={uploadedFiles}
                  onFilesChange={setUploadedFiles}
                />
              </div>

              <div>
                <PriceEstimation
                  selectedService={selectedService}
                  selectedTechnician={selectedTechnician}
                  estimatedDuration={estimatedDuration}
                  urgency={urgency}
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="customer" isAuthenticated={true} onLogout={() => {}} />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Book a Service
          </h1>
          <p className="text-muted-foreground">
            Complete the form below to request a service appointment
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg shadow-subtle">
          <div className="p-6">
            <ProgressIndicator
              currentStep={currentStep}
              steps={steps}
              onStepClick={handleStepClick}
            />

            <div className="min-h-[400px]">
              {renderStepContent()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <div className="flex items-center space-x-3">
                {currentStep > 1 && (
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    iconName="ChevronLeft"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Previous
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  onClick={handleSaveDraft}
                  iconName="Save"
                  iconPosition="left"
                  iconSize={16}
                >
                  Save Draft
                </Button>
              </div>

              <div className="flex items-center space-x-3">
                {currentStep < steps?.length ? (
                  <Button
                    onClick={handleNext}
                    disabled={!validateStep(currentStep)}
                    iconName="ChevronRight"
                    iconPosition="right"
                    iconSize={16}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    loading={isSubmitting}
                    disabled={!validateStep(currentStep)}
                    iconName="Calendar"
                    iconPosition="left"
                    iconSize={16}
                  >
                    {isSubmitting ? 'Submitting...' : 'Request Booking'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Need help with your booking?{' '}
            <button className="text-primary hover:text-primary/80 transition-micro">
              Contact Support
            </button>
          </p>
        </div>
      </main>
    </div>
  );
};

export default ServiceBookingForm;