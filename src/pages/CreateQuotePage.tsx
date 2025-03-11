import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useQuotes } from '../context/QuoteContext';
import { Check, AlertCircle, Image } from 'lucide-react';

interface FormInputs {
  creator: string;
  text: string;
  tag: string;
  theme: string;
  layout: string;
  font: string;
  imageUrl?: string; // Tambahkan field untuk URL gambar
}

const CreateQuotePage: React.FC = () => {
  const { addQuote } = useQuotes();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [imagePreviewError, setImagePreviewError] = useState<string | null>(null);

  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm<FormInputs>({
    defaultValues: {
      creator: '',
      text: '',
      tag: 'motivasi',
      theme: 'card-theme-light',
      layout: 'layout-centered',
      font: 'font-poppins',
      imageUrl: '',
    },
    mode: 'onChange' // Validasi saat perubahan terjadi
  });

  // Watch form values for live preview
  const watchAllFields = watch();
  
  // Gunakan memo untuk menghindari re-render yang tidak perlu
  const previewData = watchAllFields;

  // Validasi URL gambar
  const validateImageUrl = (url: string) => {
    if (!url) return true; // URL kosong diperbolehkan
    
    try {
      new URL(url);
      return true;
    } catch (e) {
      return 'URL gambar tidak valid';
    }
  };

  // Cek apakah gambar bisa dimuat
  const checkImageExists = async (url: string) => {
    if (!url) return;
    
    try {
      setImagePreviewError(null);
      const response = await fetch(url, { method: 'HEAD' });
      if (!response.ok) {
        setImagePreviewError('Gambar tidak dapat dimuat. Pastikan URL valid dan dapat diakses.');
      }
    } catch (error) {
      setImagePreviewError('Gambar tidak dapat dimuat. Pastikan URL valid dan dapat diakses.');
    }
  };

  // Pantau perubahan URL gambar
  useEffect(() => {
    if (previewData.imageUrl) {
      checkImageExists(previewData.imageUrl);
    } else {
      setImagePreviewError(null);
    }
  }, [previewData.imageUrl]);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Jika tema adalah qimage tapi tidak ada URL gambar, tambahkan error
      if (data.theme === 'card-theme-qimage' && !data.imageUrl) {
        setSubmitError('URL gambar diperlukan untuk tema Qimage');
        setIsSubmitting(false);
        return;
      }

      await addQuote({
        text: data.text,
        creator: data.creator || undefined,
        tag: data.tag,
        theme: data.theme,
        layout: data.layout,
        font: data.font,
        imageUrl: data.imageUrl, // Tambahkan URL gambar ke quote
      });
      
      setSubmitSuccess(true);
      
      // Redirect to home page after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error submitting quote:', error);
      setSubmitError('Gagal menambahkan quote. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fungsi untuk mendapatkan warna tag
  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'motivasi':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'sedih':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'cinta':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'inspirasi':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'humor':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">Buat Quote Baru</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Creator Input */}
            <div className="mb-6">
              <label htmlFor="creator" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nama Creator (Opsional)
              </label>
              <input
                id="creator"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                placeholder="Masukkan nama Anda (opsional)"
                {...register('creator')}
              />
            </div>
            
            {/* Quote Text */}
            <div className="mb-6">
              <label htmlFor="text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Teks Quote <span className="text-red-500">*</span>
              </label>
              <textarea
                id="text"
                rows={4}
                className={`w-full px-4 py-2 border ${errors.text ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
                placeholder="Masukkan teks quote Anda"
                {...register('text', { required: 'Teks quote wajib diisi' })}
              ></textarea>
              {errors.text && (
                <p className="mt-1 text-sm text-red-500">{errors.text.message}</p>
              )}
            </div>
            
            {/* Tag Selection */}
            <div className="mb-6">
              <label htmlFor="tag" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Jenis Tag <span className="text-red-500">*</span>
              </label>
              <select
                id="tag"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                {...register('tag', { required: true })}
              >
                <option value="motivasi">Motivasi</option>
                <option value="sedih">Sedih</option>
                <option value="cinta">Cinta</option>
                <option value="inspirasi">Inspirasi</option>
                <option value="humor">Humor</option>
              </select>
            </div>
            
            {/* Theme Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tema Card <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <label className="relative cursor-pointer">
                  <input
                    type="radio"
                    className="sr-only"
                    value="card-theme-light"
                    {...register('theme', { required: true })}
                  />
                  <div className={`p-3 rounded-md border-2 ${previewData.theme === 'card-theme-light' ? 'border-primary-500' : 'border-gray-300 dark:border-gray-700'} bg-white text-gray-800`}>
                    <div className="text-center">Terang</div>
                  </div>
                </label>
                
                <label className="relative cursor-pointer">
                  <input
                    type="radio"
                    className="sr-only"
                    value="card-theme-dark"
                    {...register('theme', { required: true })}
                  />
                  <div className={`p-3 rounded-md border-2 ${previewData.theme === 'card-theme-dark' ? 'border-primary-500' : 'border-gray-300 dark:border-gray-700'} bg-gray-900 text-white`}>
                    <div className="text-center">Gelap</div>
                  </div>
                </label>
                
                <label className="relative cursor-pointer">
                  <input
                    type="radio"
                    className="sr-only"
                    value="card-theme-gradient-blue"
                    {...register('theme', { required: true })}
                  />
                  <div className={`p-3 rounded-md border-2 ${previewData.theme === 'card-theme-gradient-blue' ? 'border-primary-500' : 'border-gray-300 dark:border-gray-700'} bg-gradient-to-r from-blue-500 to-indigo-600 text-white`}>
                    <div className="text-center">Biru</div>
                  </div>
                </label>
                
                <label className="relative cursor-pointer">
                  <input
                    type="radio"
                    className="sr-only"
                    value="card-theme-gradient-purple"
                    {...register('theme', { required: true })}
                  />
                  <div className={`p-3 rounded-md border-2 ${previewData.theme === 'card-theme-gradient-purple' ? 'border-primary-500' : 'border-gray-300 dark:border-gray-700'} bg-gradient-to-r from-purple-500 to-pink-500 text-white`}>
                    <div className="text-center">Ungu</div>
                  </div>
                </label>
                
                <label className="relative cursor-pointer">
                  <input
                    type="radio"
                    className="sr-only"
                    value="card-theme-nature"
                    {...register('theme', { required: true })}
                  />
                  <div className={`p-3 rounded-md border-2 ${previewData.theme === 'card-theme-nature' ? 'border-primary-500' : 'border-gray-300 dark:border-gray-700'} bg-green-700 text-white`}>
                    <div className="text-center">Alam</div>
                  </div>
                </label>
                
                <label className="relative cursor-pointer">
                  <input
                    type="radio"
                    className="sr-only"
                    value="card-theme-minimal"
                    {...register('theme', { required: true })}
                  />
                  <div className={`p-3 rounded-md border-2 ${previewData.theme === 'card-theme-minimal' ? 'border-primary-500' : 'border-gray-300 dark:border-gray-700'} bg-gray-50 text-gray-800`}>
                    <div className="text-center">Minimal</div>
                  </div>
                </label>

                {/* Tema Qimage baru */}
                <label className="relative cursor-pointer">
                  <input
                    type="radio"
                    className="sr-only"
                    value="card-theme-qimage"
                    {...register('theme', { required: true })}
                  />
                  <div className={`p-3 rounded-md border-2 ${previewData.theme === 'card-theme-qimage' ? 'border-primary-500' : 'border-gray-300 dark:border-gray-700'} bg-gradient-to-tr from-gray-900 to-gray-800 text-white`}>
                    <div className="text-center flex items-center justify-center">
                      <Image className="h-4 w-4 mr-1" />
                      <span>Qimage</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>
            
            {/* Image URL Input - Hanya muncul jika tema Qimage dipilih */}
            {previewData.theme === 'card-theme-qimage' && (
              <div className="mb-6">
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  URL Gambar <span className="text-red-500">*</span>
                </label>
                <input
                  id="imageUrl"
                  type="text"
                  className={`w-full px-4 py-2 border ${errors.imageUrl ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
                  placeholder="https://example.com/image.jpg"
                  {...register('imageUrl', { 
                    validate: validateImageUrl,
                    required: previewData.theme === 'card-theme-qimage' ? 'URL gambar wajib diisi untuk tema Qimage' : false
                  })}
                />
                {errors.imageUrl && (
                  <p className="mt-1 text-sm text-red-500">{errors.imageUrl.message}</p>
                )}
                {imagePreviewError && (
                  <p className="mt-1 text-sm text-red-500">{imagePreviewError}</p>
                )}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Masukkan URL gambar yang valid (contoh: https://images.unsplash.com/photo-xxx)
                </p>
              </div>
            )}
            
            {/* Layout Selection - Hanya tampilkan jika bukan tema Qimage */}
            {previewData.theme !== 'card-theme-qimage' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tata Letak <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <label className="relative cursor-pointer">
                    <input
                      type="radio"
                      className="sr-only"
                      value="layout-centered"
                      {...register('layout', { required: true })}
                    />
                    <div className={`p-3 rounded-md border-2 ${previewData.layout === 'layout-centered' ? 'border-primary-500' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
                      <div className="text-center">Tengah</div>
                    </div>
                  </label>
                  
                  <label className="relative cursor-pointer">
                    <input
                      type="radio"
                      className="sr-only"
                      value="layout-left"
                      {...register('layout', { required: true })}
                    />
                    <div className={`p-3 rounded-md border-2 ${previewData.layout === 'layout-left' ? 'border-primary-500' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
                      <div className="text-left">Kiri</div>
                    </div>
                  </label>
                  
                  <label className="relative cursor-pointer">
                    <input
                      type="radio"
                      className="sr-only"
                      value="layout-right"
                      {...register('layout', { required: true })}
                    />
                    <div className={`p-3 rounded-md border-2 ${previewData.layout === 'layout-right' ? 'border-primary-500' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
                      <div className="text-right">Kanan</div>
                    </div>
                  </label>
                  
                  <label className="relative cursor-pointer">
                    <input
                      type="radio"
                      className="sr-only"
                      value="layout-minimal"
                      {...register('layout', { required: true })}
                    />
                    <div className={`p-3 rounded-md border-2 ${previewData.layout === 'layout-minimal' ? 'border-primary-500' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
                      <div className="text-center">Minimal</div>
                    </div>
                  </label>
                  
                  <label className="relative cursor-pointer">
                    <input
                      type="radio"
                      className="sr-only"
                      value="layout-bordered"
                      {...register('layout', { required: true })}
                    />
                    <div className={`p-3 rounded-md border-2 ${previewData.layout === 'layout-bordered' ? 'border-primary-500' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-4 border-current m-1`}>
                      <div className="text-center">Border</div>
                    </div>
                  </label>
                </div>
              </div>
            )}
            
            {/* Font Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Jenis Font <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <label className="relative cursor-pointer">
                  <input
                    type="radio"
                    className="sr-only"
                    value="font-poppins"
                    {...register('font', { required: true })}
                  />
                  <div className={`p-3 rounded-md border-2 ${previewData.font === 'font-poppins' ? 'border-primary-500' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-poppins`}>
                    <div className="text-center">Poppins</div>
                  </div>
                </label>
                
                <label className="relative cursor-pointer">
                  <input
                    type="radio"
                    className="sr-only"
                    value="font-playfair"
                    {...register('font', { required: true })}
                  />
                  <div className={`p-3 rounded-md border-2 ${previewData.font === 'font-playfair' ? 'border-primary-500' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-playfair`}>
                    <div className="text-center">Playfair</div>
                  </div>
                </label>
                
                <label className="relative cursor-pointer">
                  <input
                    type="radio"
                    className="sr-only"
                    value="font-montserrat"
                    {...register('font', { required: true })}
                  />
                  <div className={`p-3 rounded-md border-2 ${previewData.font === 'font-montserrat' ? 'border-primary-500' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg- gray-900 text-gray-900 dark:text-gray-100 font-montserrat`}>
                    <div className="text-center">Montserrat</div>
                  </div>
                </label>
                
                <label className="relative cursor-pointer">
                  <input
                    type="radio"
                    className="sr-only"
                    value="font-roboto"
                    {...register('font', { required: true })}
                  />
                  <div className={`p-3 rounded-md border-2 ${previewData.font === 'font-roboto' ? 'border-primary-500' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-roboto`}>
                    <div className="text-center">Roboto</div>
                  </div>
                </label>
                
                <label className="relative cursor-pointer">
                  <input
                    type="radio"
                    className="sr-only"
                    value="font-lora"
                    {...register('font', { required: true })}
                  />
                  <div className={`p-3 rounded-md border-2 ${previewData.font === 'font-lora' ? 'border-primary-500' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-lora`}>
                    <div className="text-center">Lora</div>
                  </div>
                </label>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-md font-medium text-white ${
                  isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'
                } transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan Quote'}
              </button>
            </div>
            
            {/* Success Message */}
            {submitSuccess && (
              <div className="mt-4 p-3 bg-green-100 border border-green-200 text-green-800 rounded-md flex items-center">
                <Check className="h-5 w-5 mr-2" />
                <span>Quote berhasil disimpan! Mengalihkan ke halaman utama...</span>
              </div>
            )}
            
            {/* Error Message */}
            {submitError && (
              <div className="mt-4 p-3 bg-red-100 border border-red-200 text-red-800 rounded-md flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>{submitError}</span>
              </div>
            )}
          </form>
        </div>
        
        {/* Preview Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">Preview</h2>
          
          {/* Preview untuk tema Qimage */}
          {previewData.theme === 'card-theme-qimage' ? (
            <div className={`${previewData.theme} ${previewData.font} rounded-xl overflow-hidden shadow-lg min-h-[300px]`}>
              <div className="qimage-container h-full">
                <div className="relative">
                  {previewData.imageUrl ? (
                    <img 
                      src={previewData.imageUrl} 
                      alt="Quote background" 
                      className="qimage-img"
                      onError={() => setImagePreviewError('Gambar tidak dapat dimuat. Pastikan URL valid dan dapat diakses.')}
                    />
                  ) : (
                    <div className="qimage-img bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                      <Image className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="qimage-content">
                  <p className="text-lg md:text-xl mb-4">
                    {previewData.text || 'Masukkan teks quote Anda'}
                  </p>
                  {previewData.creator && (
                    <p className="mt-2 text-sm font-medium">— {previewData.creator}</p>
                  )}
                  <div className="mt-4 flex justify-between items-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${getTagColor(previewData.tag)}`}>
                      {previewData.tag}
                    </span>
                    <span className="text-xs opacity-80">
                      {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Preview untuk tema lainnya
            <div className={`${previewData.theme} ${previewData.layout} ${previewData.font} rounded-xl overflow-hidden shadow-lg min-h-[300px]`}>
              <div className="h-full flex flex-col justify-between">
                <div className="flex-grow flex items-center justify-center p-6">
                  <p className="text-lg md:text-xl">
                    {previewData.text || 'Masukkan teks quote Anda'}
                  </p>
                </div>
                
                <div className="p-4 bg-white/10 backdrop-blur-sm">
                  <div className="flex justify-between items-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${getTagColor(previewData.tag)}`}>
                      {previewData.tag}
                    </span>
                    <span className="text-xs opacity-80">
                      {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  {previewData.creator && (
                    <p className="mt-2 text-sm font-medium">— {previewData.creator}</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            Preview ini menunjukkan bagaimana quote Anda akan terlihat secara real-time. Sesuaikan pengaturan di formulir untuk mengubah tampilan.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateQuotePage;