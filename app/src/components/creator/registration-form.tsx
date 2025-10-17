"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  validateDisplayName,
  validateEnsName,
  validateSocialHandle,
  validateUrl,
} from "@/lib/profile-utils";
import {
  User,
  Mail,
  Globe,
  Twitter,
  Instagram,
  Youtube,
  MessageSquare,
  ImageIcon,
  Sparkles,
} from "lucide-react";

interface CreatorRegistrationFormProps {
  onSubmit: (formData: CreatorFormData) => void;
  isLoading: boolean;
  error: string;
  success: string;
  initialData?: Partial<CreatorFormData>;
  isEditing?: boolean;
}

export interface CreatorFormData {
  ensName: string;
  displayName: string;
  profileMessage: string;
  avatarUrl: string;
  websiteUrl: string;
  twitterHandle: string;
  instagramHandle: string;
  youtubeHandle: string;
  discordHandle: string;
}

export default function CreatorRegistrationForm({
  onSubmit,
  isLoading,
  error,
  success,
  initialData,
  isEditing = false,
}: CreatorRegistrationFormProps) {
  const [formData, setFormData] = useState<CreatorFormData>({
    ensName: initialData?.ensName || "",
    displayName: initialData?.displayName || "",
    profileMessage: initialData?.profileMessage || "",
    avatarUrl: initialData?.avatarUrl || "",
    websiteUrl: initialData?.websiteUrl || "",
    twitterHandle: initialData?.twitterHandle || "",
    instagramHandle: initialData?.instagramHandle || "",
    youtubeHandle: initialData?.youtubeHandle || "",
    discordHandle: initialData?.discordHandle || "",
  });

  const [validationErrors, setValidationErrors] = useState<
    Partial<CreatorFormData>
  >({});
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const validateField = (field: keyof CreatorFormData, value: string) => {
    let validation = { isValid: true, error: "" };

    switch (field) {
      case "ensName":
        validation = validateEnsName(value);
        break;
      case "displayName":
        validation = validateDisplayName(value);
        break;
      case "profileMessage":
        if (value.length > 500) {
          validation = {
            isValid: false,
            error: "Description must be less than 500 characters",
          };
        }
        break;
      case "avatarUrl":
      case "websiteUrl":
        validation = validateUrl(value);
        break;
      case "twitterHandle":
        validation = validateSocialHandle(value, "twitter");
        break;
      case "instagramHandle":
        validation = validateSocialHandle(value, "instagram");
        break;
      case "youtubeHandle":
        validation = validateSocialHandle(value, "youtube");
        break;
      case "discordHandle":
        validation = validateSocialHandle(value, "discord");
        break;
    }

    setValidationErrors((prev) => ({
      ...prev,
      [field]: validation.isValid ? "" : validation.error,
    }));

    return validation.isValid;
  };

  const handleInputChange = (field: keyof CreatorFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.ensName &&
          formData.displayName &&
          !validationErrors.ensName &&
          !validationErrors.displayName
        );
      case 2:
        return !!formData.profileMessage && !validationErrors.profileMessage;
      case 3:
        return true; // Social links are optional
      default:
        return false;
    }
  };

  const getCompletionPercentage = (): number => {
    const requiredFields = [
      formData.ensName,
      formData.displayName,
      formData.profileMessage,
    ];
    const optionalFields = [
      formData.avatarUrl,
      formData.websiteUrl,
      formData.twitterHandle,
      formData.instagramHandle,
      formData.youtubeHandle,
      formData.discordHandle,
    ];

    const completedRequired = requiredFields.filter(Boolean).length;
    const completedOptional = optionalFields.filter(Boolean).length;

    return Math.round(
      ((completedRequired * 2 + completedOptional) /
        (requiredFields.length * 2 + optionalFields.length)) *
        100
    );
  };

  const handleNext = () => {
    if (currentStep < totalSteps && isStepValid(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (isStepValid(1) && isStepValid(2)) {
      onSubmit(formData);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--push-pink-500)] text-white mb-4">
          <User className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-semibold">Basic Information</h3>
        <p className="text-muted-foreground">
          Let&apos;s start with your basic creator details
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ensName" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            ENS Name *
          </Label>
          <Input
            id="ensName"
            placeholder="yourname.eth"
            value={formData.ensName}
            onChange={(e) => handleInputChange("ensName", e.target.value)}
            className={validationErrors.ensName ? "border-red-500" : ""}
            disabled={isEditing}
          />
          {validationErrors.ensName && (
            <p className="text-sm text-red-500">{validationErrors.ensName}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {isEditing ? "ENS name cannot be changed" : "This will be your unique identifier and tip link"}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="displayName" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Display Name *
          </Label>
          <Input
            id="displayName"
            placeholder="Your Creator Name"
            value={formData.displayName}
            onChange={(e) => handleInputChange("displayName", e.target.value)}
            className={validationErrors.displayName ? "border-red-500" : ""}
            maxLength={50}
          />
          {validationErrors.displayName && (
            <p className="text-sm text-red-500">
              {validationErrors.displayName}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            {formData.displayName.length}/50 characters
          </p>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--push-purple-500)] text-white mb-4">
          <Mail className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-semibold">Profile Details</h3>
        <p className="text-muted-foreground">
          Tell your supporters about yourself
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="profileMessage" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            About You *
          </Label>
          <Textarea
            id="profileMessage"
            placeholder="Tell your supporters about yourself, your content, and why they should support you..."
            value={formData.profileMessage}
            onChange={(e) =>
              handleInputChange("profileMessage", e.target.value)
            }
            className={validationErrors.profileMessage ? "border-red-500" : ""}
            rows={4}
            maxLength={500}
          />
          {validationErrors.profileMessage && (
            <p className="text-sm text-red-500">
              {validationErrors.profileMessage}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            {formData.profileMessage.length}/500 characters
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="avatarUrl" className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Avatar URL (Optional)
          </Label>
          <Input
            id="avatarUrl"
            placeholder="https://example.com/avatar.jpg"
            value={formData.avatarUrl}
            onChange={(e) => handleInputChange("avatarUrl", e.target.value)}
            className={validationErrors.avatarUrl ? "border-red-500" : ""}
          />
          {validationErrors.avatarUrl && (
            <p className="text-sm text-red-500">{validationErrors.avatarUrl}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="websiteUrl" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Website URL (Optional)
          </Label>
          <Input
            id="websiteUrl"
            placeholder="https://yourwebsite.com"
            value={formData.websiteUrl}
            onChange={(e) => handleInputChange("websiteUrl", e.target.value)}
            className={validationErrors.websiteUrl ? "border-red-500" : ""}
          />
          {validationErrors.websiteUrl && (
            <p className="text-sm text-red-500">
              {validationErrors.websiteUrl}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-[var(--push-pink-500)] to-[var(--push-purple-500)] text-white mb-4">
          <Globe className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-semibold">Social Media</h3>
        <p className="text-muted-foreground">
          Connect your social media accounts (all optional)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="twitterHandle" className="flex items-center gap-2">
            <Twitter className="w-4 h-4" />
            Twitter
          </Label>
          <Input
            id="twitterHandle"
            placeholder="@username"
            value={formData.twitterHandle}
            onChange={(e) => handleInputChange("twitterHandle", e.target.value)}
            className={validationErrors.twitterHandle ? "border-red-500" : ""}
          />
          {validationErrors.twitterHandle && (
            <p className="text-sm text-red-500">
              {validationErrors.twitterHandle}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="instagramHandle" className="flex items-center gap-2">
            <Instagram className="w-4 h-4" />
            Instagram
          </Label>
          <Input
            id="instagramHandle"
            placeholder="@username"
            value={formData.instagramHandle}
            onChange={(e) =>
              handleInputChange("instagramHandle", e.target.value)
            }
            className={validationErrors.instagramHandle ? "border-red-500" : ""}
          />
          {validationErrors.instagramHandle && (
            <p className="text-sm text-red-500">
              {validationErrors.instagramHandle}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="youtubeHandle" className="flex items-center gap-2">
            <Youtube className="w-4 h-4" />
            YouTube
          </Label>
          <Input
            id="youtubeHandle"
            placeholder="@channel"
            value={formData.youtubeHandle}
            onChange={(e) => handleInputChange("youtubeHandle", e.target.value)}
            className={validationErrors.youtubeHandle ? "border-red-500" : ""}
          />
          {validationErrors.youtubeHandle && (
            <p className="text-sm text-red-500">
              {validationErrors.youtubeHandle}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="discordHandle" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Discord
          </Label>
          <Input
            id="discordHandle"
            placeholder="username#1234"
            value={formData.discordHandle}
            onChange={(e) => handleInputChange("discordHandle", e.target.value)}
            className={validationErrors.discordHandle ? "border-red-500" : ""}
          />
          {validationErrors.discordHandle && (
            <p className="text-sm text-red-500">
              {validationErrors.discordHandle}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Card className="bg-card/50 backdrop-blur border-border/60">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-[var(--push-pink-500)]" />
          {isEditing ? "Edit Your Creator Profile" : "Create Your Creator Profile"}
        </CardTitle>
        <div className="space-y-2">
          <Progress value={getCompletionPercentage()} className="w-full" />
          <p className="text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps} • {getCompletionPercentage()}%
            Complete
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Step Indicators */}
        <div className="flex justify-center space-x-4">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                step === currentStep
                  ? "bg-[var(--push-pink-500)] text-white"
                  : step < currentStep
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {step < currentStep ? "✓" : step}
            </div>
          ))}
        </div>

        {/* Step Content */}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={!isStepValid(currentStep)}
              className="bg-[var(--push-pink-500)] hover:bg-[var(--push-pink-600)]"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !isStepValid(1) || !isStepValid(2)}
              className="bg-gradient-to-r from-[var(--push-pink-500)] to-[var(--push-purple-500)] hover:from-[var(--push-pink-600)] hover:to-[var(--push-purple-600)]"
            >
              {isLoading 
                ? (isEditing ? "Updating Profile..." : "Creating Profile...") 
                : (isEditing ? "Update Profile" : "Create Profile")}
            </Button>
          )}
        </div>

        {/* Status Messages */}
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
            {success}
          </div>
        )}

        {/* Required Fields Notice */}
        <div className="text-xs text-muted-foreground text-center">
          <Badge variant="outline" className="mr-2">
            Required
          </Badge>
          Fields marked with * are required
        </div>
      </CardContent>
    </Card>
  );
}
