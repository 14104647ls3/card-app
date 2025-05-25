'use client'

import * as React from "react";
import { DropdownMenu } from "radix-ui";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export function CardPopover({ formId, onFormCloned }: { formId: string; onFormCloned?: () => void }){
	const router = useRouter();
	const [showToast, setShowToast] = useState(false);

	const copySubmissionLink = async () => {
		try {
			await navigator.clipboard.writeText(`${window.location.origin}/form/${formId}`);
			setShowToast(true);
		} catch (error) {
			console.error('Failed to copy link:', error);
			// Fallback for older browsers
			const textArea = document.createElement('textarea');
			textArea.value = `${window.location.origin}/form/${formId}`;
			document.body.appendChild(textArea);
			textArea.select();
			document.execCommand('copy');
			document.body.removeChild(textArea);
			setShowToast(true);
		}
	};

	useEffect(() => {
		if (showToast) {
			const timer = setTimeout(() => {
				setShowToast(false);
			}, 3000); // Hide toast after 3 seconds
			
			return () => clearTimeout(timer);
		}
	}, [showToast]);

	const cloneForm = async () => {
		try {
			// First, fetch the existing form data
			const response = await fetch(`/api/forms/${formId}`);
			if (!response.ok) {
				throw new Error('Failed to fetch form data');
			}
			
			const formData = await response.json();
			
			// Create a new form with cloned data
			const clonedForm = {
				title: `${formData.title} (Copy)`,
				description: formData.description || '',
				questions: formData.questions || []
			};
			
			// Create the cloned form
			const createResponse = await fetch('/api/forms', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(clonedForm)
			});
			
			if (!createResponse.ok) {
				throw new Error('Failed to create cloned form');
			}
			
			const newForm = await createResponse.json();
			
			// Call the callback to refresh the forms list if provided
			if (onFormCloned) {
				onFormCloned();
			}
			
			// Redirect to edit the cloned form
			router.push(`/form/${newForm._id}/edit`);
			
		} catch (error) {
			console.error('Error cloning form:', error);
			alert('Failed to clone form. Please try again.');
		}
	};

	return (
		<div className="relative">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild>
					<button
						className="inline-flex size-[35px] items-center justify-center hover:bg-[var(--ocean-blue)] hover:text-white transition-all duration-200"
						aria-label="Customise options"
					>
						<HamburgerMenuIcon />
					</button>
				</DropdownMenu.Trigger>

				<DropdownMenu.Portal>
					<DropdownMenu.Content
						className="min-w-[100px] rounded-md bg-white p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade "
						sideOffset={2}
					>
	                    <DropdownMenu.Item
	                        onClick={copySubmissionLink}
	                        className="group relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-[var(--pale-blue)] data-[disabled]:text-mauve8 data-[highlighted]:text-violet1">
							Copy Survey Link{" "}
							<div className="ml-auto pl-5 text-mauve11 group-data-[disabled]:text-mauve8 group-data-[highlighted]:text-white">
								<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M4.62471 4.00001L4.56402 4.00001C4.04134 4.00001 3.70687 4.00262 3.43747 4.01844C3.16243 4.03469 2.94715 4.06546 2.73998 4.12833C2.41069 4.23462 2.13498 4.45222 2.0077 4.73135C1.91269 4.93054 1.86875 5.14842 1.84526 5.40816C1.82353 5.65061 1.81866 5.95516 1.81866 6.43084L1.81866 10.5691C1.81866 11.0448 1.82353 11.3494 1.84526 11.5918C1.86875 11.8516 1.91269 12.0695 2.0077 12.2687C2.13498 12.5478 2.41069 12.7654 2.73998 12.8717C2.94715 12.9345 3.16243 12.9653 3.43747 12.9816C3.70687 12.9974 4.04134 13 4.56402 13L10.436 13C10.9587 13 11.2931 12.9974 11.5625 12.9816C11.8376 12.9653 12.0529 12.9345 12.26 12.8717C12.5893 12.7654 12.865 12.5478 12.9923 12.2687C13.0873 12.0695 13.1313 11.8516 13.1547 11.5918C13.1765 11.3494 13.1813 11.0448 13.1813 10.5691L13.1813 6.43084C13.1813 5.95516 13.1765 5.65061 13.1547 5.40816C13.1313 5.14842 13.0873 4.93054 12.9923 4.73135C12.865 4.45222 12.5893 4.23462 12.26 4.12833C12.0529 4.06546 11.8376 4.03469 11.5625 4.01844C11.2931 4.00262 10.9587 4.00001 10.436 4.00001L10.3753 4.00001C10.2097 4.00001 10.0753 3.86555 10.0753 3.70001C10.0753 3.53447 10.2097 3.40001 10.3753 3.40001L10.436 3.40001C10.9635 3.40001 11.3097 3.40001 11.5956 3.41729C11.8857 3.43502 12.1223 3.47179 12.3484 3.54125C12.7181 3.66893 13.0311 3.91797 13.1829 4.26518C13.2648 4.47676 13.3102 4.70735 13.3372 4.98335C13.3633 5.25172 13.3682 5.58456 13.3682 6.09818L13.3682 10.9018C13.3682 11.4154 13.3633 11.7483 13.3372 12.0167C13.3102 12.2927 13.2648 12.5232 13.1829 12.7348C13.0311 13.082 12.7181 13.3311 12.3484 13.4587C12.1223 13.5282 11.8857 13.565 11.5956 13.5827C11.3097 13.6 10.9635 13.6 10.436 13.6L4.56402 13.6C4.03651 13.6 3.69027 13.6 3.40437 13.5827C3.11431 13.565 2.87773 13.5282 2.65159 13.4587C2.28193 13.3311 1.96889 13.082 1.81712 12.7348C1.73524 12.5232 1.68983 12.2927 1.66284 12.0167C1.6367 11.7483 1.63177 11.4154 1.63177 10.9018L1.63177 6.09818C1.63177 5.58456 1.6367 5.25172 1.66284 4.98335C1.68983 4.70735 1.73524 4.47676 1.81712 4.26518C1.96889 3.91797 2.28193 3.66893 2.65159 3.54125C2.87773 3.47179 3.11431 3.43502 3.40437 3.41729C3.69027 3.40001 4.03651 3.40001 4.56402 3.40001L4.62471 3.40001C4.79025 3.40001 4.92471 3.53447 4.92471 3.70001C4.92471 3.86555 4.79025 4.00001 4.62471 4.00001ZM7.64645 2.14645C7.84171 1.95118 8.15829 1.95118 8.35355 2.14645L10.8536 4.64645C11.0488 4.84171 11.0488 5.15829 10.8536 5.35355C10.6583 5.54882 10.3417 5.54882 10.1464 5.35355L8.5 3.70711L8.5 9.5C8.5 9.77614 8.27614 10 8 10C7.72386 10 7.5 9.77614 7.5 9.5L7.5 3.70711L5.85355 5.35355C5.65829 5.54882 5.34171 5.54882 5.14645 5.35355C4.95118 5.15829 4.95118 4.84171 5.14645 4.64645L7.64645 2.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
								</svg>
							</div>
						</DropdownMenu.Item>
	                    
	                    <DropdownMenu.Item
	                        onClick={cloneForm}
	                        className="group relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-[var(--pale-blue)] data-[disabled]:text-mauve8 data-[highlighted]:text-violet1">
							Clone Form{" "}
							<div className="ml-auto pl-5 text-mauve11 group-data-[disabled]:text-mauve8 group-data-[highlighted]:text-white">
								<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M1 9.50006C1 10.3285 1.67157 11.0001 2.5 11.0001H4L4 10.0001H2.5C2.22386 10.0001 2 9.7762 2 9.50006L2 2.50006C2 2.22392 2.22386 2.00006 2.5 2.00006L9.5 2.00006C9.77614 2.00006 10 2.22392 10 2.50006V4.00002L11 4.00002V2.50006C11 1.67163 10.3284 1.00006 9.5 1.00006H2.5C1.67157 1.00006 1 1.67163 1 2.50006V9.50006ZM5.5 4.00006C4.67157 4.00006 4 4.67163 4 5.50006V12.5001C4 13.3285 4.67157 14.0001 5.5 14.0001H12.5C13.3284 14.0001 14 13.3285 14 12.5001V5.50006C14 4.67163 13.3284 4.00006 12.5 4.00006H5.5ZM5 5.50006C5 5.22392 5.22386 5.00006 5.5 5.00006H12.5C12.7761 5.00006 13 5.22392 13 5.50006V12.5001C13 12.7762 12.7761 13.0001 12.5 13.0001H5.5C5.22386 13.0001 5 12.7762 5 12.5001V5.50006Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
								</svg>
							</div>
						</DropdownMenu.Item>
	                    
	                    <DropdownMenu.Item
	                        className="group relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-[var(--pale-blue)] data-[disabled]:text-mauve8 data-[highlighted]:text-violet1"
	                        onClick={() => {
	                            window.open(`${window.location.origin}/form/${formId}/qrcode`, '_blank');
	                            return;
	                        }}
	                    >
							Get QR Code{" "}
	                        <div className="ml-auto pl-5 text-mauve11 group-data-[disabled]:text-mauve8 group-data-[highlighted]:text-white">
								<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M1 1H1.5H4.5H5V1.5V4.5V5H4.5H1.5H1V4.5V1.5V1ZM2 2V4H4V2H2ZM10 1H10.5H13.5H14V1.5V4.5V5H13.5H10.5H10V4.5V1.5V1ZM11 2V4H13V2H11ZM1 10H1.5H4.5H5V10.5V13.5V14H4.5H1.5H1V13.5V10.5V10ZM2 11V13H4V11H2ZM7.5 1.5H6.5V2.5H7.5V1.5ZM8.5 2.5H7.5V3.5H8.5V2.5ZM6.5 3.5H7.5V4.5H6.5V3.5ZM8.5 4.5H7.5V5.5H8.5V4.5ZM6.5 5.5H7.5V6.5H6.5V5.5ZM8.5 6.5H9.5V7.5H8.5V6.5ZM9.5 8.5H8.5V9.5H9.5V8.5ZM8.5 10.5H9.5V11.5H8.5V10.5ZM9.5 12.5H8.5V13.5H9.5V12.5ZM6.5 7.5H7.5V8.5H6.5V7.5ZM7.5 9.5H6.5V10.5H7.5V9.5ZM6.5 11.5H7.5V12.5H6.5V11.5ZM7.5 13.5H6.5V14.5H7.5V13.5ZM10.5 6.5H11.5V7.5H10.5V6.5ZM11.5 8.5H10.5V9.5H11.5V8.5ZM10.5 10.5H11.5V11.5H10.5V10.5ZM11.5 12.5H10.5V13.5H11.5V12.5ZM12.5 7.5H13.5V8.5H12.5V7.5ZM13.5 9.5H12.5V10.5H13.5V9.5ZM12.5 11.5H13.5V12.5H12.5V11.5ZM13.5 13.5H12.5V14.5H13.5V13.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
								</svg>
							</div>
						</DropdownMenu.Item>
						<DropdownMenu.Arrow className="fill-white" />
					</DropdownMenu.Content>
				</DropdownMenu.Portal>
			</DropdownMenu.Root>

			{/* Toast Notification */}
			{showToast && (
				<div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in">
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" fill="currentColor"/>
					</svg>
					Link copied to clipboard
				</div>
			)}
		</div>
	);
}