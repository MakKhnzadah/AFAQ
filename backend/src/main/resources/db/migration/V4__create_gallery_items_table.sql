CREATE TABLE gallery_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title_no varchar(255) NULL,
    title_ar varchar(255) NULL,
    alt_text_no varchar(255) NOT NULL,
    alt_text_ar varchar(255) NOT NULL,
    image_key varchar(255) NOT NULL,
    content_type varchar(100) NOT NULL,
    file_size_bytes bigint NOT NULL,
    display_order integer NOT NULL DEFAULT 0,
    active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version bigint NOT NULL DEFAULT 0,
    CONSTRAINT uq_gallery_items_image_key UNIQUE (image_key),
    CONSTRAINT chk_gallery_items_alt_text_no_not_blank CHECK (btrim(alt_text_no) <> ''),
    CONSTRAINT chk_gallery_items_alt_text_ar_not_blank CHECK (btrim(alt_text_ar) <> ''),
    CONSTRAINT chk_gallery_items_image_key_not_blank CHECK (btrim(image_key) <> ''),
    CONSTRAINT chk_gallery_items_content_type_not_blank CHECK (btrim(content_type) <> ''),
    CONSTRAINT chk_gallery_items_file_size_positive CHECK (file_size_bytes > 0),
    CONSTRAINT chk_gallery_items_display_order_non_negative CHECK (display_order >= 0)
);

CREATE INDEX idx_gallery_items_active_display_order
    ON gallery_items (active, display_order, created_at);

CREATE INDEX idx_gallery_items_display_order
    ON gallery_items (display_order, created_at);
