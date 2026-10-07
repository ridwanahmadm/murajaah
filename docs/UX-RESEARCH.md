# Murajaah UX revision

Research reviewed 7 October 2026. These are desk research and design decisions, not usability-test findings.

- NN/g, Progressive Disclosure: https://www.nngroup.com/articles/progressive-disclosure/ — staged disclosure keeps a creation task understandable. Apply destination selection → source entry → review → publication, with an explicit active step.
- NN/g, Breadcrumb Navigation: https://www.nngroup.com/articles/breadcrumb-navigation-useful/ — expose the current location and parent hierarchy. Keep a labeled return control above long draft editors; distinguish creation of a new subject from addition to an existing subject.
- Quizlet Smart Assist: https://help.quizlet.com/hc/en-ca/articles/39606772122509-Creating-study-sets-with-Smart-Assist — compare typed notes and uploaded source, editable draft preview, and user approval before publication. Adapt that flow with local storage and free device inference.
- Quizlet Import: https://help.quizlet.com/hc/en-us/articles/360029977151-Creating-sets-by-importing-content — separate content import from saving/publishing; display extracted PDF text and page selection before transformation.

Implementation: retain the existing calm visual tokens and Arabic font. Font Awesome Free SVGs are bundled, not fetched from a paid kit. Six labeled destinations include study notes. Quiz starts with a motivational overview, then source/settings selection, review and a quiz session. AI preparation is an explicit action with progress/error states; never disguise a manual draft as AI output.

Local PDF.js extraction reads selectable text; scanned or encrypted documents produce an actionable message rather than fabricated OCR. Large documents use explicit page ranges and editable extracted text. User originals and personal records are not sent to a hosted AI service.

Free public AI: WebLLM runs the open Qwen3.5 model in the visitor's browser through WebGPU, after an explicit one-time download. Existing local Ollama remains supported. This broadens the previous Ollama-only project convention to meet the user's request for free AI-generated quizzes on the public app; paid/cloud inference remains prohibited. On incompatible devices, manual addition and existing quizzes remain available and the limitation is explicit.

Back navigation revision: https://www.nngroup.com/articles/consistency-and-standards/ supports predictable, consistent control placement across screens. Following the user’s chosen convention, return controls are the first row at the top-left of the relevant flow section, before step/status information. Apply the same reusable control to material creation/review, quiz setup/review and note editing. This placement is a product decision; the article is not treated as a universal coordinate rule. Cancellation of a destructive dialog remains a dialog action.
