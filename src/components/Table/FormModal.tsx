import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ListPlus,
  Trash2,
  X,
  Upload,
  Fullscreen,
  Sparkles,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import Image from "next/image";
import { useNotification } from "@/hooks/notificationContext"; // Import notification hook
import { startSpeechRecognition } from "@/utils/speechRecognition";
import { speakText } from "@/utils/textToSpeech";
import { detectUserLanguage } from "@/utils/languageDetection";

// Define the type for priorities
export type PriorityOption = { id: string; label: string };

// Add the missing createId function
function createId(): string {
  return Math.random().toString(36).substr(2, 9);
}

const FormModal = ({
  display,
  onSubmit,
  showModal,
  schema,
  fields,
  defaultValues,
  priorities,
  hashtags,
  width,
  aiType,
}: {
  display: boolean;
  onSubmit: (data: any) => void;
  showModal: () => void;
  schema: z.ZodObject<any>; // Ensure schema is a valid ZodObject
  fields: Array<{
    name: string;
    label: string;
    type:
      | "text"
      | "email"
      | "select"
      | "number"
      | "file"
      | "checkbox"
      | "hashtags"
      | "customImages";
    placeholder?: string;
    options?: { id: string; name: string }[];
    style?: string;
  }>;
  defaultValues?: any;
  priorities?: PriorityOption[];
  hashtags?: { id: string; name: string }[];
  width?: string;
  aiType?: string;
}) => {
  const form = useForm({
    resolver: zodResolver(schema), // Ensure schema is passed correctly
    defaultValues: defaultValues || {},
  });

  const { showNotification } = useNotification(); // Use notification hook
  const [selectedTab, setSelectedTab] = useState("hashtags");
  // const generateDefaultValues = async () => {
  //   try {
  //     const prompt =
  //       "product :Ordinateur Portable Lenovo IdeaPad Slim 5 14IRL8 (82XD007NFE),return at lease 1 hashtag as example search for price by morocco mad Generate default values for the form fields make sure to include properties array, hashtags, and priorities.";
  //     const response = await fetch("/api/ai-generate", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ fields, prompt, priorities, hashtags }),
  //     });

  //     if (!response.ok) {
  //       const error = await response.json();
  //       console.error("Error generating default values:", error);
  //       showNotification("Failed to generate default values", "error");
  //       return;
  //     }

  //     const {
  //       defaultValues: generatedValues,
  //       properties,
  //       hashtags: generatedHashtags,
  //       priorities: generatedPriorities,
  //       message,
  //     } = await response.json();
  //     console.log(
  //       "Generated default values:",
  //       generatedValues,
  //       generatedHashtags
  //     );

  //     // Convert generated hashtags from IDs to names
  //     const formattedHashtags = Array.isArray(generatedHashtags)
  //       ? generatedHashtags
  //           .map((id) => {
  //             // const hashtag = hashtags.find((tag) => tag.id === id);
  //             return id ? (id as string).slice(1) : null;
  //           })
  //           .filter(Boolean) // Remove null values
  //       : [];

  //     // Format generated values to match Zod schema
  //     const formattedValues = {
  //       ...generatedValues,
  //       price: parseFloat(generatedValues.price) || 0,
  //       stock: parseInt(generatedValues.stock, 10) || 0,
  //       rating: parseFloat(generatedValues.rating) || 0,
  //       discount: parseFloat(generatedValues.discount) || 0,
  //       isNew: generatedValues.isNew === "true",
  //       isPublished: generatedValues.isPublished === "true",
  //       hashtags: formattedHashtags || generatedHashtags,
  //       properties: properties || [],
  //     };

  //     // Update form state with formatted values
  //     form.reset(formattedValues);
  //     setProperties(formattedValues.properties); // Update properties
  //     setSelectedHashtags(formattedValues.hashtags); // Update selected hashtags
  //     setAvailableHashtags(
  //       (hashtags as any).filter(
  //         (tag) => !formattedHashtags.includes(`#${tag.name}`)
  //       )
  //     ); // Update available hashtags

  //     // Update priorities if returned
  //     if (generatedPriorities) {
  //       console.log("Generated priorities:", generatedPriorities);
  //     }

  //     showNotification(message, "success");
  //   } catch (error) {
  //     console.error("Error generating default values:", error);
  //     showNotification("An unexpected error occurred", "error");
  //   }
  // };

  const [description, setDescription] = useState<
    Array<{ id: string; name: string; value: string }>
  >(defaultValues?.description || []);

  const [properties, setProperties] = useState<
    Array<{ id: string; name: string; value: string }>
  >(defaultValues?.properties || []);

  const [selectedHashtags, setSelectedHashtags] = useState<string[]>(
    defaultValues?.hashtags || []
  );
  const [availableHashtags, setAvailableHashtags] = useState<
    { id: string; name: string }[]
  >(hashtags || []);

  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [defaultImages, setDefaultImages] = useState<string[]>(
    defaultValues?.images || []
  );
  const [mainImage, setMainImage] = useState<string | null>(
    defaultValues?.image || null
  );

  const [filePreview, setFilePreview] = useState<string | null>(null);

  const [voiceCommand, setVoiceCommand] = useState<string>("");
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [showAIInput, setShowAIInput] = useState(false); // Toggle for AI input section

  const handlePrompt = async (command: string, isVoice: boolean) => {
    setLoading(true);
    const detectedLanguage = detectUserLanguage(command);

    try {
      const response = await fetch("/api/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields, prompt: command,priorities: priorities?priorities:[], hashtags:hashtags?hashtags:[],type:aiType?aiType:"common" }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error generating default values:", error);
        showNotification("Failed to generate default values", "error");
        setLoading(false);
        return;
      }

      const {
        defaultValues: generatedValues,
        properties,
        hashtags: generatedHashtags,
        message,
      } = await response.json();

      const formattedHashtags = Array.isArray(generatedHashtags)
      ? generatedHashtags
          .map((id) => {
            // const hashtag = hashtags.find((tag) => tag.id === id);
            return id ? (id as string).slice(1) : null;
          })
          .filter(Boolean) // Remove null values
      : [];
      const formattedValues = {
        ...generatedValues,
        price: parseFloat(generatedValues.price) || 0,
        stock: parseInt(generatedValues.stock, 10) || 0,
        rating: parseFloat(generatedValues.rating) || 0,
        discount: parseFloat(generatedValues.discount) || 0,
        isNew: generatedValues.isNew === "true",
        isPublished: generatedValues.isPublished === "true",
        hashtags: formattedHashtags || generatedHashtags,
        properties: properties || [],
      };

      form.reset(formattedValues);
      setMessage(message || "Default values generated successfully.");
      setLoading(false);
      setProperties(formattedValues.properties);
      setSelectedHashtags(formattedValues.hashtags);
      setAvailableHashtags(
        (Array.isArray(hashtags) ? hashtags : []).filter(
          (tag) => !formattedHashtags.includes(`#${tag.name}`)
        )
      ); // Ensure hashtags is an array before filtering
      console.log("generatedValues", generatedValues);
      console.log("properties", properties);
      console.log("generatedHashtags", generatedHashtags);
      console.log("message", message);

      // Speak the message if input was via voice
      if (isVoice && message) {
        speakText(message, detectedLanguage);
      }
    } catch (error) {
      console.error("Error generating default values:", error);
      showNotification("An unexpected error occurred", "error");
      setLoading(false);
    }
  };

  const handleVoiceCommand = async () => {
    setIsRecording(true);

    startSpeechRecognition(
      "en-US",
      async (transcript) => {
        setVoiceCommand(transcript);
        await handlePrompt(transcript, true);
        setIsRecording(false);
      },
      (error) => {
        console.error("Speech recognition error:", error);
        setIsRecording(false);
      }
    );
  };

  const cancelVoiceCommand = () => {
    setIsRecording(false);
    setVoiceCommand("");
    setMessage("Welcome! Ask me anything.");
    setLoading(false);
  };

  const handleTextAreaKeyDown = async (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (voiceCommand.trim()) {
        await handlePrompt(voiceCommand, false);
      }
    }
  };

  const toggleAIInput = () => {
    setShowAIInput((prev) => !prev); // Toggle the AI input section
  };

  useEffect(() => {
    // Reset the form with default values when they change
    form.reset(defaultValues || {}); // Ensure defaultValues is not undefined
    console.log("default valeus", defaultValues);
    setDescription(defaultValues?.description || []);
    setProperties(defaultValues?.properties || []);

    // Ensure selectedHashtags is an array of strings
    const selected = Array.isArray(defaultValues?.hashtags)
      ? defaultValues.hashtags
      : [];
    setSelectedHashtags(selected);

    // Filter available hashtags to exclude selected ones
    const available = Array.isArray(hashtags)
      ? hashtags.filter((tag) => !selected.includes(tag.name))
      : [];
    setAvailableHashtags(available);

    setDefaultImages(defaultValues?.images || []);
    setMainImage(defaultValues?.image || null);
  }, [defaultValues, hashtags, form]);

  const handleHashtagSelect = (hashtag: { id: string; name: string }) => {
    if (!selectedHashtags.includes(hashtag.name)) {
      setSelectedHashtags((prev) => [...prev, hashtag.name]); // Add to selected hashtags
      setAvailableHashtags((prev) =>
        prev.filter((tag) => tag.id !== hashtag.id)
      ); // Remove from available hashtags
    }
  };

  const handleHashtagDeselect = (hashtagName: string) => {
    if (!selectedHashtags.includes(hashtagName)) return;
     setSelectedHashtags((prev) => prev?.filter((tag) => tag !== hashtagName)); // Remove from selected hashtags
    const deselectedHashtag = hashtags?.find((tag) => tag.name === hashtagName); // Find the deselected hashtag
    if (deselectedHashtag) {
      setAvailableHashtags((prev) => [...prev, deselectedHashtag]); // Add back to available hashtags
    }
  };

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).slice(
      0,
      5 - uploadedImages.length - defaultImages.length
    ); // Limit to 5 images
    setUploadedImages((prev:any) => [...prev, ...newFiles]);
  };

  const handleRemoveUploadedImage = (index: number) => {
    setUploadedImages((prev:any) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveDefaultImage = (url: string) => {
    
    setDefaultImages((prev:any) => prev?.filter((img) => img !== url));
  };

  const handleSetMainImage = (url: string) => {
    setMainImage(url);
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setFilePreview(URL.createObjectURL(file)); // Generate a preview URL for the uploaded file
  };

  const handleRemoveFilePreview = () => {
    setFilePreview(null); // Clear the preview
  };

  const handleSubmit = (data: any) => {
    console.log("Submitting form data:", data);

    const validationResult = schema.safeParse(data); // Use safeParse on the Zod schema
    if (!validationResult.success) {
      const errors = validationResult.error.errors
        .map((err) => err.message)
        .join(", ");
      console.error("Validation errors:", errors);
      return;
    }

    const formDataWithProperties = {
      ...data,
      description: typeof data.description === "string" ? data.description : "", // Ensure description is a string
      properties,
      hashtags: selectedHashtags, // Ensure hashtags are passed correctly
      images: uploadedImages.length > 0 ? uploadedImages : undefined,
      deletedImages:
        defaultValues?.images?.filter(
          (img: string) => !defaultImages.includes(img)
        ) || [],
      mainImage,
    };

    // console.log("Final form data to submit:", formDataWithProperties);

    // Call the onSubmit function and reset the form state
    onSubmit(formDataWithProperties);

    // Reset the form state after submission
    form.reset({});
    setProperties([]);
    setSelectedHashtags([]);
    setUploadedImages([]);
    setDefaultImages([]);
    setMainImage(null);
  };

  const close = () => {
    showModal();
    form.reset({});
  };

  // Add helper functions for managing properties
  const addProperty = () => {
    setProperties((prev) => [...prev, { id: createId(), name: "", value: "" }]);
  };

  const removeProperty = (id: string) => {
    setProperties((prev) => prev.filter((prop) => prop.id !== id));
  };

  const handlePropertyChange = (
    id: string,
    field: "name" | "value",
    value: string
  ) => {
    setProperties((prev) =>
      prev.map((prop) => (prop.id === id ? { ...prop, [field]: value } : prop))
    );
  };

  return (
    <>
      {display && (
        <div className="fixed z-[9999] top-0 left-0 flex w-full h-full bg-black/15 backdrop-blur-sm justify-center items-center ">
          <div
            className={`bg-white dark:bg-black px-4 py-3 rounded-md border border-black/10 dark:border-white/10 ${
              width || "min-w-[30%]"
            }`}
          >
            <div className="flex justify-between py-3">
              <h3 className="capitalize text-lg">Form</h3>
              <button className="hover:opacity-50" onClick={close}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Toggle AI Input Section */}
            <div className="col-span-12 flex justify-end">
              <Button variant="ghost" type="button" onClick={toggleAIInput}>
                <Sparkles size={16} className="mr-2" />
                Ai
              </Button>
            </div>

         <div className=" overflow-y-auto">
         {showAIInput && (
              <>
                <div className="w-full flex text-xs px-3 my-1">
                  <div
                    className={` text-center ${
                      message || loading ? "w-full" : "w-0"
                    } duration-300 ease-in-out`}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <span className=" opacity-50">{"Thinking..."}</span>
                        <Sparkles
                          className="text-primary animate-pulse"
                          size={15}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className=" opacity-70">{message}</span>
                        <Sparkles className="text-primary" size={15} />
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-full border-gray-2 border relative rounded-3xl p-3">
                  <textarea
                    value={voiceCommand}
                    onChange={(e) => setVoiceCommand(e.target.value)}
                    onKeyDown={handleTextAreaKeyDown}
                    className="w-full  outline-none bg-transparent border-none"
                    placeholder="Ask AI to generate default values"
                  ></textarea>
                  <button
                    onClick={handleVoiceCommand}
                    disabled={isRecording}
                    className="absolute bottom-5 right-5 flex h-7 items-center justify-center rounded-full bg-primary text-white transition-colors focus-visible:outline-none focus-visible:outline-black disabled:text-gray-50 disabled:opacity-30 can-hover:hover:opacity-70 dark:bg-white dark:text-black w-7"
                  >
                    {isRecording ? (
                      <div className="relative flex items-center justify-center">
                        <Sparkles size={20} />
                        <div className="absolute w-10 h-10 border-4 border-primary/50 rounded-full animate-ping"></div>
                      </div>
                    ) : (
                      <Sparkles size={20} />
                    )}
                  </button>
                  {isRecording && (
                    <button
                      onClick={cancelVoiceCommand}
                      className="absolute bottom-5 right-16 flex h-7 items-center justify-center rounded-full bg-gray-2 text-gray-4 transition-colors focus-visible:outline-none focus-visible:outline-black disabled:text-gray-50 disabled:opacity-30 can-hover:hover:opacity-70 dark:bg-white dark:text-black w-7"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </>
            )}
         <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)} // Correctly invoke form.handleSubmit
                className={`grid grid-cols-12 gap-2 ${width}`}
              >
                {/* Add AI Generate Button */}
                <div className="col-span-12 flex justify-end mb-4"></div>
                {fields.map((field) => {
                  switch (field.type) {
                    case "text":
                    case "email":
                      return (
                        <div
                          key={field.name}
                          className={`p-0 m-0 ${
                            field.style ? field.style : "col-span-12"
                          }`}
                        >
                          <FormField
                            control={form.control}
                            name={field.name}
                            render={({ field: controllerField }) => (
                              <FormItem>
                                <FormLabel>{field.label}</FormLabel>
                                <FormControl>
                                  <Input
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    {...controllerField}
                                    value={controllerField.value || ""}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      );
                    case "number":
                      return (
                        <div
                          key={field.name}
                          className={field.style ? field.style : "col-span-12"}
                        >
                          <FormField
                            control={form.control}
                            name={field.name}
                            render={({ field: controllerField }) => (
                              <FormItem>
                                <FormLabel>{field.label}</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder={field.placeholder}
                                    {...controllerField}
                                    value={controllerField.value || ""}
                                    onChange={(e) =>
                                      controllerField.onChange(
                                        e.target.value === ""
                                          ? undefined
                                          : parseFloat(e.target.value)
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      );
                    case "checkbox":
                      return (
                        <div
                          key={field.name}
                          className={field.style ? field.style : "col-span-12"}
                        >
                          <FormField
                            control={form.control}
                            name={field.name}
                            render={({ field: controllerField }) => (
                              <FormItem>
                                <FormLabel>{field.label}</FormLabel>
                                <FormControl>
                                  <Checkbox
                                    {...controllerField}
                                    checked={controllerField.value || false}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      );
                    case "select":
                      return (
                        <div
                          key={field.name}
                          className={field.style ? field.style : "col-span-12"}
                        >
                          <FormField
                            control={form.control}
                            name={field.name}
                            render={({
                              field: controllerField,
                              fieldState,
                            }) => (
                              <FormItem>
                                <FormLabel>
                                  <span
                                    className={
                                      fieldState.invalid ? "text-red-500" : ""
                                    }
                                  >
                                    {field.label}
                                  </span>
                                </FormLabel>
                                <FormControl>
                                  <Select
                                    value={
                                      controllerField.value !== undefined
                                        ? controllerField.value.toString() // Convert value to string
                                        : field.options?.[0]?.id || "" // Default to the first option if no value is set
                                    }
                                    onValueChange={(value) => {
                                      if (
                                        value === "true" ||
                                        value === "false"
                                      ) {
                                        controllerField.onChange(
                                          value === "true"
                                        );
                                      } else if (!isNaN(Number(value))) {
                                        controllerField.onChange(Number(value)); // Convert back to number for numeric fields like rating
                                      } else if (value === "admin") {
                                        controllerField.onChange("admin");
                                        console.log("value", value);
                                      } else {
                                        controllerField.onChange(value);
                                        console.log("value", value);
                                      }
                                    }}
                                  >
                                    <SelectTrigger
                                      className={`w-[180px] ${
                                        fieldState.invalid
                                          ? "border-red-500"
                                          : ""
                                      }`}
                                    >
                                      <SelectValue
                                        placeholder={field.placeholder}
                                      >
                                        {field.options?.find(
                                          (option) =>
                                            option.id ===
                                            (controllerField.value !== undefined
                                              ? controllerField.value.toString() // Convert value to string for comparison
                                              : field.options?.[0]?.id || "")
                                        )?.name || field.placeholder}
                                      </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                      {field.options?.map((option: any) => (
                                        <SelectItem
                                          key={option.id}
                                          value={option.id}
                                        >
                                          {option.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                {fieldState.invalid && (
                                  <FormMessage>
                                    <span className="text-red-500">
                                      {fieldState.error?.message}
                                    </span>
                                  </FormMessage>
                                )}
                              </FormItem>
                            )}
                          />
                        </div>
                      );
                    case "file":
                      return (
                        <div
                          key={field.name}
                          className={field.style || "col-span-12"}
                        >
                          <FormLabel>{field.label}</FormLabel>
                          <div className="flex w-full gap-4 items-center">
                            {/* Upload Input */}
                            {defaultImages.length + uploadedImages.length <
                              5 && (
                              <div className="flex items-center mt-2">
                                <label className="cursor-pointer p-2 border rounded-md hover:bg-primary/5 flex items-center gap-2 text-blue-500">
                                  <Upload size={20} />
                                  <Input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) =>
                                      handleImageUpload(e.target.files)
                                    }
                                  />
                                </label>
                              </div>
                            )}
                            {/* Default Images */}
                            {defaultImages.map((url, index) => (
                              <div
                                key={index}
                                className="relative p-2 bg-gray-2  border rounded-lg"
                              >
                                <Image
                                  src={url}
                                  alt={`Default Image ${index + 1}`}
                                  width={70}
                                  height={70}
                                  className="rounded-md object-cover h-10 w-auto"
                                />
                                <button
                                  type="button"
                                  className="absolute top-0 right-0  border text-primary bg-white rounded-full p-1"
                                  onClick={() => handleRemoveDefaultImage(url)}
                                >
                                  <Trash2 size={16} />
                                </button>
                                <button
                                  type="button"
                                  className={`absolute border text-primary  bottom-0 left-0 bg bg-white
                                     p-1
                                    rounded-full ${
                                      mainImage === url ? "opacity-90" : ""
                                    }`}
                                  onClick={() => handleSetMainImage(url)}
                                  disabled={mainImage === url}
                                >
                                  <Fullscreen size={16} />
                                </button>
                              </div>
                            ))}

                            <div className="border-l px-3 flex gap-1 overflow-x-auto w-full">
                              {/* Uploaded Images */}
                              <div className="flex gap-2 p-2 bg-gray-2  border rounded-lg">
                                {uploadedImages.map((file, index) => (
                                  <div key={index} className="relative flex ">
                                    <Image
                                      src={URL.createObjectURL(file)}
                                      alt={`Uploaded Image ${index + 1}`}
                                      width={70}
                                      height={70}
                                      className="rounded-md object-cover h-auto w-20"
                                    />
                                    <button
                                      type="button"
                                      className="absolute top-0 right-0 text-primary bg-white rounded-full p-1"
                                      onClick={() =>
                                        handleRemoveUploadedImage(index)
                                      }
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <FormMessage />
                        </div>
                      );
                    default:
                      return null;
                  }
                })}
                  {priorities && hashtags&&
                     <div className="flex gap-2">
                     <Button variant={'link'}
                      onClick={(e)=>{e.preventDefault(); setSelectedTab("priorities")}}>Priorities</Button>
                     <Button variant={'link'} onClick={(e)=>{e.preventDefault();setSelectedTab("hashtags")}}>Hashtags</Button>
                   </div>
                  }
                {priorities && hashtags&& (
        <>
           {selectedTab==="priorities"&&(
                         <div className="w-full h-[100px] col-span-12">
                         <div className="flex flex-col border rounded-md px-3 py-2  h-[70px] overflow-y-auto">
                           {Array.isArray(properties) &&
                             properties.map((prop) => (
                               <div
                                 key={prop.id}
                                 className="flex items-center space-x-4 mt-2 w-full"
                               >
                                 <Select
                                   value={prop.name}
                                   onValueChange={(value) =>
                                     handlePropertyChange(prop.id, "name", value)
                                   }
                                 >
                                   <SelectTrigger className="w-[180px]">
                                     <SelectValue placeholder="Select property">
                                       {priorities.find(
                                         (priority) => priority.label === prop.name
                                       )?.label || "Select property"}
                                     </SelectValue>
                                   </SelectTrigger>
                                   <SelectContent>
                                     {priorities.map((priority) => (
                                       <SelectItem
                                         key={priority.id}
                                         value={priority.label}
                                       >
                                         {priority.label}
                                       </SelectItem>
                                     ))}
                                   </SelectContent>
                                 </Select>
                                 <Input
                                   value={prop.value}
                                   onChange={(e) =>
                                     handlePropertyChange(
                                       prop.id,
                                       "value",
                                       e.target.value
                                     )
                                   }
                                   placeholder="Enter value"
                                 />
                                 <Button
                                   variant="ghost"
                                   onClick={() => removeProperty(prop.id)}
                                 >
                                   <svg
                                     xmlns="http://www.w3.org/2000/svg"
                                     fill="none"
                                     viewBox="0 0 24 24"
                                     strokeWidth={1.5}
                                     stroke="currentColor"
                                     className="w-5 h-5"
                                   >
                                     <path
                                       strokeLinecap="round"
                                       strokeLinejoin="round"
                                       d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                     />
                                   </svg>
                                 </Button>
                               </div>
                             ))}
                         </div>
     
                         <div className="my-3">
                           <Button
                             type="button"
                             variant="ghost"
                             onClick={(e) => {
                               e.preventDefault();
                               addProperty();
                             }}
                           >
                             <ListPlus size={18} />
                           </Button>
                         </div>
                       </div>
                )}
                {selectedTab==="hashtags"&&   <>
                <div className="col-span-12 h-[100px]">
                  <div className="flex gap-2 ">
                    {/* Outbox: Available Hashtags */}
                    <div className="border p-2 rounded-md w-full">
                      <h4 className="text-xs mb-2">Available</h4>
                      <div className="flex flex-wrap gap-2">
                        {availableHashtags.map((hashtag) => (
                          <button
                            key={hashtag.id}
                            type="button"
                            className="px-3 py-1 rounded-md bg-gray-200 text-black"
                            onClick={() => handleHashtagSelect(hashtag)}
                          >
                            #{hashtag.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Selection Area: Selected Hashtags */}
                    <div className="border p-2 rounded-md w-full">
                      <h4 className="text-xs mb-2">Selected</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedHashtags.map((hashtagName) => (
                          <div
                            key={hashtagName}
                            className="flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500 "
                          >
                            <span>#{hashtagName}</span>
                            <button
                              type="button"
                              onClick={() =>
                                handleHashtagDeselect(hashtagName)
                              }
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              
                 </> }
        </>
                )}
                <div className="col-span-12 mt-3 flex justify-end">
                  <Button variant="ghost" type="submit">
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
         </div>

          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
