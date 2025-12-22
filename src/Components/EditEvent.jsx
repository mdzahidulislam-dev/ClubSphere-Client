import axios from "axios";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { GrDocumentUpdate } from "react-icons/gr";
import { FaLocationDot } from "react-icons/fa6";
import { MdFeed, MdOutlineAttachMoney } from "react-icons/md";
import { RiImageAddFill, RiUploadCloud2Fill } from "react-icons/ri";
import Swal from "sweetalert2";
import useAxios from "../Hooks/useAxios";
import useAuth from "../Hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";

const EditEvent = ({ closeModal, selectedEvent }) => {
  const [imgPreview, setImgPreview] = useState("");
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();
  const today = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      eventName: "",
      clubId: "",
      description: "",
      location: "",
      eventFee: "0",
      eventDate: "",
      eventTime: "",
      bannerImage: null,
    },
  });

  useEffect(() => {
    if (selectedEvent) {
      reset({
        clubId: selectedEvent.clubId || "",
        eventName: selectedEvent.eventName || "",
        description: selectedEvent.description || "",
        location: selectedEvent.location || "",
        eventFee: selectedEvent.eventFee || "0",
        eventDate: selectedEvent.eventDate || "",
        eventTime: selectedEvent.eventTime || "",
        bannerImage: null,
      });

      // bannerImage
      if (selectedEvent.bannerImage) {
        setImgPreview(selectedEvent.bannerImage);
      }
    }
  }, [selectedEvent, reset]);

  const description = useWatch({
    control,
    name: "description",
    defaultValue: "",
  });
  const bannerImage = useWatch({
    control,
    name: "bannerImage",
  });
  useEffect(() => {
    if (bannerImage && bannerImage.length > 0) {
      const file = bannerImage[0];
      const previewUrl = URL.createObjectURL(file);
      setImgPreview(previewUrl);

      return () => URL.revokeObjectURL(previewUrl);
    }
  }, [bannerImage]);

  const UpdateEvent = async (data) => {
 

    try {
      setIsSubmitting(true);
      let eventsImg = selectedEvent.bannerImage;

      // Upload new image if provided
      if (data?.bannerImage?.length > 0) {
        const formData = new FormData();
        formData.append("image", data.bannerImage[0]);

        const url = `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_image_hosting_key
        }`;
        const res = await axios.post(url, formData);
        eventsImg = res.data.data.display_url;
      }

      // Prepare update data
      data.bannerImage = eventsImg;
      data.managerEmail = user.email;

      // Create eventDateTime by combining eventDate and eventTime
      if (data.eventDate && data.eventTime) {
        data.eventDateTime = `${data.eventDate}T${data.eventTime}`;
      }

      // Add update timestamps
      data.updateAt = new Date().toISOString();
      data.updateDate = new Date().toLocaleDateString("en-GB");
      data.updateTime = new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });

      // Send update to backend
      await axiosSecure.patch(`/events/${selectedEvent._id}`, data);
      queryClient.invalidateQueries(["myEvents", user?.email]);
      queryClient.invalidateQueries(["all-events"]);

      // Invalidate queries to refresh data
      queryClient.invalidateQueries(["myEvents", user?.email]);

      // Success message
      Swal.fire({
        title: "Success!",
        text: "Event updated successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });

      // Close modal
      closeModal();
    } catch (error) {
      console.error("Error updating event:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update event. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to cancel? All unsaved changes will be lost!!!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FF5656",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Close it!",
    }).then((result) => {
      if (result.isConfirmed) {
        reset();
        closeModal();
      }
    });
  };

  return (
    <div className="min-h-screen font-display flex flex-col overflow-x-hidden">
      <main className="grow flex justify-center ">
        <div className="w-full max-w-[960px] flex flex-col gap-8">
          {/* Page Heading */}
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-primary text-3xl md:text-4xl font-bold leading-tight tracking-[-0.033em]">
              Update Your Event Info
            </h1>

            <p className="text-secondary text-base font-normal leading-normal md:mx-20">
              Update your Event information here so members always see the
              latest details. Make changes anytime you need.
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-surface-dark/30 border border-primary/50 rounded-xl p-6 md:p-8 shadow-xl ">
            <form
              onSubmit={handleSubmit(UpdateEvent)}
              className="flex flex-col gap-8">
              <div className="flex flex-col gap-6">
                <div className="border-b border-primary/50 pb-2">
                  <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">
                      <MdFeed />
                    </span>
                    Basic Information
                  </h3>
                </div>

                {/* Club Name */}
                <label className="flex flex-col gap-2 relative">
                  <span className="text-sm font-medium">
                    Event Name <span className="text-red-400">*</span>
                  </span>
                  <input
                    className="w-full rounded-lg bg-surface-dark border border-primary/50 placeholder:text-gray-400 focus:border-primary/50 focus:ring-1 focus:ring-primary h-12 px-4 transition-all"
                    type="text"
                    placeholder="e.g. Photography Contest"
                    {...register("eventName", {
                      required: "Event Name is required",
                      minLength: {
                        value: 3,
                        message: "Event Name must be at least 3 characters",
                      },
                    })}
                  />
                  {errors.eventName && (
                    <div className="absolute -top-1 right-0 bg-red-500 text-white text-xs px-3 py-1 rounded shadow-lg animate-fadeIn">
                      {errors.eventName.message}
                    </div>
                  )}
                </label>

                {/* Description */}
                <label className="flex flex-col gap-2 md:col-span-2 relative">
                  <span className="text-sm font-medium">
                    Description <span className="text-red-400">*</span>
                  </span>
                  <textarea
                    className="w-full rounded-lg bg-surface-dark border border-primary/50 placeholder:text-gray-400 focus:border-primary/50 focus:ring-1 focus:ring-primary min-h-[120px] p-4 transition-all resize-y"
                    placeholder="Tell potential members what you do, your mission, and who should Register..."
                    {...register("description", {
                      required: "Description is required",
                      maxLength: {
                        value: 1000,
                        message: "Description cannot exceed 1000 characters",
                      },
                      minLength: {
                        value: 50,
                        message: "Description should be at least 50 characters",
                      },
                    })}
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-text-secondary">
                      {description.length}/1000 characters
                    </span>

                    {errors.description && (
                      <div className="absolute -top-1 right-0 bg-red-500 text-white text-xs px-3 py-1 rounded shadow-lg animate-fadeIn">
                        {errors.description.message}
                      </div>
                    )}
                  </div>
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Event Date */}
                  <label className="flex flex-col gap-2 relative">
                    <span className=" text-sm font-medium">
                      Event Date <span className="text-red-400">*</span>
                    </span>
                    <input
                      type="date"
                      min={today}
                      className="w-full rounded-lg bg-surface-dark border border-primary/50 
  focus:border-primary/50 focus:ring-1 focus:ring-primary h-12 px-4 transition-all"
                      {...register("eventDate", {
                        required: "Event date is required",
                      })}
                    />
                    {errors.eventDate && (
                      <div className="absolute -top-1 right-0 bg-red-500 text-white text-xs px-3 py-1 rounded shadow-lg">
                        {errors.eventDate.message}
                      </div>
                    )}
                  </label>

                  {/* Event Time */}
                  <label className="flex flex-col gap-2 relative">
                    <span className=" text-sm font-medium">
                      Event Time <span className="text-red-400">*</span>
                    </span>
                    <input
                      type="time"
                      className="w-full rounded-lg bg-surface-dark border border-primary/50 
    focus:border-primary/50 focus:ring-1 focus:ring-primary h-12 px-4 transition-all"
                      {...register("eventTime", {
                        required: "Event time is required",
                      })}
                    />
                    {errors.eventTime && (
                      <div className="absolute -top-1 right-0 bg-red-500 text-white text-xs px-3 py-1 rounded shadow-lg">
                        {errors.eventTime.message}
                      </div>
                    )}
                  </label>
                </div>

                {/* Location */}
                <label className="flex flex-col gap-2 relative">
                  <span className=" text-sm font-medium">
                    Location <span className="text-red-400">*</span>
                  </span>
                  <div className="relative">
                    <input
                      className="w-full rounded-lg bg-surface-dark border border-primary/50 placeholder:text-gray-400 focus:border-primary/50 focus:ring-1 focus:ring-primary h-12 pl-10 px-4 transition-all"
                      type="text"
                      placeholder="City, Zip or Virtual"
                      {...register("location", {
                        required: "Location is required",
                      })}
                    />
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[20px]">
                      <FaLocationDot />
                    </span>
                  </div>
                  {errors.location && (
                    <div className="absolute -top-1 right-0 bg-red-500 text-white text-xs px-3 py-1 rounded shadow-lg animate-fadeIn">
                      {errors.location.message}
                    </div>
                  )}
                </label>
                {/* Membership Fee */}
                <label className="flex flex-col gap-2">
                  <span className=" text-sm font-medium">Event Fee</span>
                  <div className="relative">
                    <input
                      className="w-full rounded-lg bg-surface-dark border border-primary/50 placeholder:text-gray-400 focus:border-primary/50 focus:ring-1 focus:ring-primary h-12 pl-10 px-4 transition-all"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      {...register("eventFee", {
                        required: "Event fee is required",
                        min: {
                          value: 0,
                          message: "Fee cannot be negative",
                        },
                      })}
                    />
                    {errors.eventFee && (
                      <div className="absolute -top-8 right-0 bg-red-500 text-white text-xs px-3 py-1 rounded shadow-lg animate-fadeIn">
                        {errors.eventFee.message}
                      </div>
                    )}
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[20px]">
                      <MdOutlineAttachMoney />
                    </span>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded">
                        USD
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-text-secondary">
                    Enter 0 for free Register
                  </span>
                </label>
              </div>

              {/* Section 3: Branding */}
              <div className="flex flex-col gap-6">
                <div className="border-b border-primary/50 pb-2">
                  <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">
                      <RiImageAddFill />
                    </span>
                    Branding
                  </h3>
                </div>
              </div>
              {/* File Upload */}
              <div className="flex flex-col gap-2">
                <span className="text-primary text-sm font-medium">
                  Banner Image <span className="text-red-400">*</span>
                </span>
                <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                  {/* Upload Area */}
                  <div className="w-full ">
                    <label
                      className="flex flex-col items-center justify-center w-full h-48 border-2 border-primary/50 border-dashed rounded-lg cursor-pointer bg-surface-dark/50 hover:bg-surface-dark transition-all hover:border-primary/50 group relative"
                      htmlFor="dropzone-file">
                      {imgPreview ? (
                        <img
                          src={imgPreview}
                          alt="Banner Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <div className="p-3 rounded-full bg-surface-dark mb-3">
                            <RiUploadCloud2Fill
                              size={60}
                              className="text-secondary"
                            />
                          </div>
                          <p className="mb-2 text-sm text-text-secondary">
                            <span className="font-semibold text-primary">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-text-secondary/70">
                            SVG, PNG, JPG or GIF (MAX. 800x400px)
                          </p>
                        </div>
                      )}

                      <input
                        className="hidden"
                        id="dropzone-file"
                        type="file"
                        accept="image/*"
                        {...register("bannerImage", {
                          validate: (fileList) => {
                            if (!fileList || fileList.length === 0) return true;
                            return true;
                          },
                        })}
                      />
                      {errors.bannerImage && (
                        <div className="absolute -top-8 right-0 bg-red-500 text-white text-xs px-3 py-1 rounded shadow-lg animate-fadeIn">
                          {errors.bannerImage.message}
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-4">
                <button
                  type="button"
                  className="px-8 py-3 rounded-lg text-primary font-bold border border-primary/50 hover:bg-primary hover:text-white transition-all w-full sm:w-auto"
                  onClick={handleCancel}
                  disabled={isSubmitting}>
                  Cancel
                </button>
                <button
                  className="px-8 py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                      Updating...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[20px]">
                        <GrDocumentUpdate />
                      </span>
                      Update
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditEvent;
