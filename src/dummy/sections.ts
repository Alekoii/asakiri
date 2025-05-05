// src/dummy/sections.ts
import type { Section } from "../types/section.types";

export const dummySections: Section[] = [
    // Japanese Unit 1 Sections
    {
        id: "section-001",
        title: "Basic Greetings Grammar",
        description: "Grammar patterns for Japanese greetings",
        section_type: "grammar",
        content_json: {
            explanation:
                "<p>In Japanese, greetings change based on the time of day and level of formality.</p><p>The basic structure is: <strong>[Greeting] + です</strong></p>",
            examples: [
                {
                    text: "おはようございます",
                    translation: "Good morning (formal)",
                },
                { text: "こんにちは", translation: "Good afternoon/Hello" },
                { text: "こんばんは", translation: "Good evening" },
                { text: "さようなら", translation: "Goodbye" },
            ],
            practice: [
                {
                    question:
                        'How would you say "Good morning" formally in Japanese?',
                    options: [
                        "こんにちは",
                        "おはよう",
                        "おはようございます",
                        "さようなら",
                    ],
                    answer: "おはようございます",
                },
            ],
        },
        unit_id: "unit-001",
        is_standalone: false,
        serial_number: 1,
        created_at: "2023-01-16T11:00:00Z",
        updated_at: "2023-01-16T11:00:00Z",
    },
    {
        id: "section-002",
        title: "Greeting Vocabulary",
        description: "Essential Japanese greeting terms",
        section_type: "vocabulary",
        content_json: {},
        unit_id: "unit-001",
        is_standalone: false,
        serial_number: 2,
        created_at: "2023-01-16T11:30:00Z",
        updated_at: "2023-01-16T11:30:00Z",
    },
    {
        id: "section-003",
        title: "First Day in Japan",
        description: "A short reading about first interactions in Japan",
        section_type: "reading",
        content_json: {
            text:
                "<p>山田さんは日本人です。スミスさんはアメリカ人です。スミスさんは日本に来ました。</p><p>スミスさん：はじめまして。スミスです。どうぞよろしくお願いします。</p><p>山田さん：はじめまして。山田です。どうぞよろしくお願いします。</p>",
            translation:
                "<p>Mr. Yamada is Japanese. Mr. Smith is American. Mr. Smith came to Japan.</p><p>Mr. Smith: Nice to meet you. I'm Smith. Please treat me well.</p><p>Mr. Yamada: Nice to meet you. I'm Yamada. Please treat me well.</p>",
            questions: [
                {
                    question: "Who is Japanese?",
                    options: ["Smith", "Yamada", "Neither"],
                    answer: "Yamada",
                },
            ],
        },
        unit_id: "unit-001",
        is_standalone: false,
        serial_number: 3,
        created_at: "2023-01-16T12:00:00Z",
        updated_at: "2023-01-16T12:00:00Z",
    },

    // Standalone Alphabet Sections for Japanese
    {
        id: "section-004",
        title: "Hiragana Characters",
        description: "The basic Japanese phonetic alphabet",
        section_type: "alphabet",
        content_json: {
            characters: [
                { char: "あ", romanization: "a", sound: "ah" },
                { char: "い", romanization: "i", sound: "ee" },
                { char: "う", romanization: "u", sound: "oo" },
                { char: "え", romanization: "e", sound: "eh" },
                { char: "お", romanization: "o", sound: "oh" },
            ],
        },
        unit_id: "null",
        is_standalone: true,
        serial_number: 1,
        created_at: "2023-01-15T09:00:00Z",
        updated_at: "2023-01-15T09:00:00Z",
    },
    {
        id: "section-005",
        title: "Katakana Characters",
        description: "Japanese alphabet used primarily for foreign words",
        section_type: "alphabet",
        content_json: {
            characters: [
                { char: "ア", romanization: "a", sound: "ah" },
                { char: "イ", romanization: "i", sound: "ee" },
                { char: "ウ", romanization: "u", sound: "oo" },
                { char: "エ", romanization: "e", sound: "eh" },
                { char: "オ", romanization: "o", sound: "oh" },
            ],
        },
        unit_id: "null",
        is_standalone: true,
        serial_number: 2,
        created_at: "2023-01-15T10:30:00Z",
        updated_at: "2023-01-15T10:30:00Z",
    },

    // Spanish Unit 1 Sections
    {
        id: "section-006",
        title: "Introducing Yourself",
        description: "Grammar for personal introductions in Spanish",
        section_type: "grammar",
        content_json: {
            explanation:
                "<p>In Spanish, introducing yourself typically uses the verb <strong>ser</strong> (to be) and <strong>llamarse</strong> (to call oneself).</p>",
            examples: [
                { text: "Soy María.", translation: "I am María." },
                {
                    text: "Me llamo Juan.",
                    translation: "My name is Juan. (lit: I call myself Juan)",
                },
                {
                    text: "¿Cómo te llamas?",
                    translation:
                        "What is your name? (lit: How do you call yourself?)",
                },
            ],
        },
        unit_id: "unit-004",
        is_standalone: false,
        serial_number: 1,
        created_at: "2023-03-12T14:30:00Z",
        updated_at: "2023-03-12T14:30:00Z",
    },
    {
        id: "section-007",
        title: "Meeting People Vocabulary",
        description: "Essential Spanish terms for introductions",
        section_type: "vocabulary",
        content_json: {},
        unit_id: "unit-004",
        is_standalone: false,
        serial_number: 2,
        created_at: "2023-03-12T15:00:00Z",
        updated_at: "2023-03-12T15:00:00Z",
    },
];
