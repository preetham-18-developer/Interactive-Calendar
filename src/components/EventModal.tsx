import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Trash2, Image as ImageIcon } from 'lucide-react';
import type { CalendarEvent, EventType } from '../types';

interface EventModalProps {
  dateStr: string;
  existingEvents: CalendarEvent[];
  onClose: () => void;
  onSave: (event: CalendarEvent | CalendarEvent[]) => void;
  onDelete: (id: string) => void;
  isMissionMode?: boolean;
}

const EVENT_TYPES: EventType[] = [
  'Meeting',
  'Birthday',
  'Anniversary',
  'Festival',
  'Holiday',
];
export function EventModal({
  dateStr,
  existingEvents,
  onClose,
  onSave,
  onDelete,
  isMissionMode,
}: EventModalProps) {
  const existingEvent = existingEvents.find((e) => e.dateStr === dateStr);

  const [title, setTitle] = useState(existingEvent?.title || '');
  const [type, setType] = useState<EventType>(existingEvent?.type || (isMissionMode ? 'Meeting' : 'Meeting')); // default check
  const [note, setNote] = useState(existingEvent?.note || '');
  const [problemCount, setProblemCount] = useState<number | string>(existingEvent?.problemCount || '');
  const [formulas, setFormulas] = useState(existingEvent?.formulas || '');
  const [images, setImages] = useState<string[]>(existingEvent?.images || []);
  const fileRef = useRef<HTMLInputElement>(null);

  const isEditing = !!existingEvent;

  // Format display date
  const displayDate = (() => {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  })();

  const handleSubmit = () => {
    if (!title.trim()) return;

    const event: CalendarEvent = {
      id: existingEvent?.id || crypto.randomUUID(),
      userId: existingEvent?.userId || '',
      dateStr,
      title: title.trim(),
      type,
      note: note.trim() || undefined,
      problemCount: problemCount !== '' ? Number(problemCount) : undefined,
      formulas: formulas.trim() || undefined,
      images: images.length > 0 ? images : undefined,
    };

    onSave(event);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    if (files.length + images.length > 4) {
      alert('Maximum 4 images allowed.');
      return;
    }

    Array.from(files).forEach((file) => {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image must be under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setImages((prev) =>
            prev.length < 4 ? [...prev, ev.target!.result as string] : prev
          );
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <motion.div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: -4 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Header */}
        <div className="modal-card__header">
          <div>
            <h2 className="modal-card__title">
              {isEditing ? 'Event Details' : 'New Event'}
            </h2>
            <p className="modal-card__subtitle">{displayDate}</p>
          </div>
          <button
            className="icon-btn"
            onClick={onClose}
            id="modal-close-btn"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <div className="form-group">
          <label className="form-label" htmlFor="event-title">
            {isMissionMode ? 'Topic Covered' : 'Title'}
          </label>
          <input
            id="event-title"
            className="form-input"
            type="text"
            placeholder={isMissionMode ? "Ex: Binary Search, Graphs..." : "Event name"}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
        </div>

        {isMissionMode && (
          <div className="form-group">
            <label className="form-label" htmlFor="problem-count">
              No. of Problems Covered
            </label>
            <input
              id="problem-count"
              className="form-input"
              type="number"
              placeholder="Ex: 5"
              value={problemCount}
              onChange={(e) => setProblemCount(e.target.value)}
            />
          </div>
        )}

        {!isMissionMode ? (
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="event-type">
                Category
              </label>
              <select
                id="event-type"
                className="form-input form-select"
                value={type}
                onChange={(e) => setType(e.target.value as EventType)}
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Images ({images.length}/4)</label>
              <div
                className="image-upload-zone"
                onClick={() => fileRef.current?.click()}
              >
                <ImageIcon size={16} style={{ marginBottom: 2 }} />
                <span> Add photos</span>
              </div>
              <input
                type="file"
                ref={fileRef}
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        ) : (
          <div className="form-group">
             <label className="form-label">Related Screenshots ({images.length}/4)</label>
              <div
                className="image-upload-zone"
                onClick={() => fileRef.current?.click()}
              >
                <ImageIcon size={16} style={{ marginBottom: 2 }} />
                <span> Upload progress proof or diagrams</span>
              </div>
              <input
                type="file"
                ref={fileRef}
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
          </div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor={isMissionMode ? "event-formulas" : "event-note"}>
            {isMissionMode ? 'Formulas / Key Patterns' : 'Note'}
          </label>
          <textarea
            id={isMissionMode ? "event-formulas" : "event-note"}
            className="form-input form-textarea"
            placeholder={isMissionMode ? "Paste formulas or logic patterns here..." : "Additional details (optional)"}
            value={isMissionMode ? formulas : note}
            onChange={(e) => isMissionMode ? setFormulas(e.target.value) : setNote(e.target.value)}
            rows={isMissionMode ? 5 : 3}
          />
        </div>

        {/* Image preview */}
        {images.length > 0 && (
          <div className="image-preview-grid">
            {images.map((img, i) => (
              <div key={i} className="image-preview-item">
                <img src={img} alt={`Upload ${i + 1}`} />
                <button
                  className="image-preview-item__remove"
                  onClick={() => removeImage(i)}
                  aria-label={`Remove image ${i + 1}`}
                >
                  <Trash2 size={10} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div style={{ marginTop: 'var(--space-4)' }}>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            id="save-event-btn"
          >
            {isEditing ? 'Update Event' : 'Save Event'}
          </button>

          {isEditing && (
            <button
              className="btn-danger"
              onClick={() => onDelete(existingEvent!.id)}
              id="delete-event-btn"
            >
              Delete Event
            </button>
          )}

          <button
            className="btn-secondary"
            onClick={onClose}
            id="cancel-event-btn"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}
