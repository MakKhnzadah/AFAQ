package no.afaq.api

class GalleryItemNotFoundException : RuntimeException("Gallery item not found")

class GalleryImageNotFoundException : RuntimeException("Gallery image not found")

class InvalidImageUploadException(message: String) : RuntimeException(message)

class FileStorageException(message: String, cause: Throwable? = null) : RuntimeException(message, cause)
