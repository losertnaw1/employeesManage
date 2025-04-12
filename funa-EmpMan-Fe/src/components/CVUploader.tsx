import { FC, useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import '../styles/CVUploader.css';
import { toast } from './ToastContainer';

interface CVUploaderProps {
  employeeId: string;
  cvUrl?: string | null;
  onUploadSuccess: (cvUrl: string) => void;
  onSkip?: () => void; // Optional callback when user skips CV upload
}

const CVUploader: FC<CVUploaderProps> = ({ employeeId, cvUrl, onUploadSuccess, onSkip }) => {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Extract filename from cvUrl if available
  useEffect(() => {
    if (cvUrl) {
      const parts = cvUrl.split('/');
      setFileName(parts[parts.length - 1]);
    }
  }, [cvUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      const errorMsg = t('invalidFileType') || 'Invalid file type. Please upload PDF or Word documents.';
      toast.error(errorMsg);
      setError(errorMsg);
      return;
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      const errorMsg = t('fileTooLarge') || 'File is too large. Maximum size is 5MB.';
      toast.error(errorMsg);
      setError(errorMsg);
      return;
    }

    try {
      setUploading(true);
      setError(null);

      // Trực tiếp sử dụng axios thay vì gọi qua hàm API
      const formData = new FormData();
      formData.append('cv', file);

      // Gọi trực tiếp đến API endpoint
      const response = await axios.post(
        `http://localhost:5000/api/employees/${employeeId}/upload-cv`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const result = response.data;

      if (result.cvUrl) {
        onUploadSuccess(result.cvUrl);
        setFileName(file.name);
      }
    } catch (err) {
      console.error('Error uploading CV:', err);
      const errorMsg = t('uploadError') || 'Failed to upload CV. Please try again.';
      toast.error(errorMsg);
      setError(errorMsg);
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDownload = async () => {
    if (!cvUrl) return;

    try {
      // Trực tiếp sử dụng axios thay vì gọi qua hàm API
      const response = await axios.get(
        `http://localhost:5000/api/employees/${employeeId}/download-cv`,
        { responseType: 'blob' }
      );

      const blob = response.data;

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || 'cv.pdf';
      document.body.appendChild(a);
      a.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading CV:', err);
      const errorMsg = t('downloadError') || 'Failed to download CV. Please try again.';
      toast.error(errorMsg);
      setError(errorMsg);
    }
  };

  return (
    <div className="cv-uploader">
      <div className="cv-uploader-header">
        <h3>{t('uploadCV')}</h3>
      </div>

      {error && (
        <div className="cv-uploader-error">
          {error}
        </div>
      )}

      <div className="cv-uploader-content">
        {fileName ? (
          <div className="cv-file-info">
            <span className="cv-file-name">{fileName}</span>
            <button
              className="cv-download-button"
              onClick={handleDownload}
              disabled={!cvUrl}
            >
              {t('downloadCV')}
            </button>
          </div>
        ) : (
          <div className="cv-no-file">
            <span>{t('noCV')}</span>
          </div>
        )}

        <div className="cv-upload-controls">
          <input
            type="file"
            id="cv-file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            style={{ display: 'none' }}
          />
          <label
            htmlFor="cv-file"
            className="cv-upload-button"
          >
            {uploading ? t('uploading') || 'Đang tải lên...' : t('uploadCV') || 'Tải CV lên'}
          </label>

          {/* Hiển thị nút "Bỏ qua" nếu có hàm onSkip */}
          {onSkip && (
            <button
              type="button"
              className="cv-skip-button"
              onClick={onSkip}
              disabled={uploading}
            >
              {t('skip') || 'Bỏ qua'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CVUploader;
