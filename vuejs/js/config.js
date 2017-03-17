var ALConfig = {
	// Components Library
	components: {
		View: 'AL-View',
		Label: 'AL-Label',
		Button: 'AL-Button',
		Image: 'AL-Image'
	},
	// Attribute-inspector Configs
	attributes: {
		Screen: {
			style: {
				'Height': 'height',
				'Bg-Color': 'background-color'
			}
		},
		'AL-View': {
			style: {
				'Z-Index': 'z-index',
				'Width': 'width',
				'Height': 'height',
				'Left': 'left',
				'Top': 'top',
				'Padding': 'padding',
				'Border': 'border',
				'Bd-Radius': 'border-radius',
				'Bg-Color': 'background-color'
			},
			data: {}
		},
		'AL-Label': {
			style: {
				'Z-Index': 'z-index',
				'Font': 'font-family',
				'FontSize': 'font-size',
				'Color': 'color',
				'Width': 'width',
				'Height': 'height',
				'Left': 'left',
				'Top': 'top',
				'Padding': 'padding',
				'Border': 'border',
				'Bd-Radius': 'border-radius',
				'Bg-Color': 'background-color'
			},
			data: {
				'Text': 'al-text'
			}
		},
		'AL-Button': {
			style: {
				'Z-Index': 'z-index',
				'FontSize': 'font-size',
				'Font': 'font-family',
				'Width': 'width',
				'Height': 'height',
				'Left': 'left',
				'Top': 'top',
				'Padding': 'padding',
				'Border': 'border',
				'Bd-Radius': 'border-radius',
				'Bg-Color': 'background-color',
				'Text-Color': 'color',
			},
			data: {
				'Text': 'al-text'
			}
		},
		'AL-Image': {
			style: {
				'Z-Index': 'z-index',
				'Width': 'width',
				'Height': 'height',
				'Left': 'left',
				'Top': 'top',
				'Border': 'border',
				'Bd-Radius': 'border-radius',
				'Image-Url': 'background-image',
				'Image-Pos': 'background-position',
				'Image-Size': 'background-size'
			},
			data: {}
		},
	},
	// Constraint-inspector Configs
	constraints: {
		single: {
			Size: {
				'Width': 'c-width',
				'Height': 'c-height'
			},
			Spacing: {
				'Leading Space': 'c-leading-space',
				'Top Space': 'c-top-space',
				'Trailing Space': 'c-trailing-space',
				'Bottom Space': 'c-bottom-space'
			},
			Align: {
				'Herizontally in Screen': 'c-herizontally-in-box',
				'Vertically in Screen': 'c-vertically-in-box'
			}
		},
		multi: {
			'Equal Width': 'c-equal-width',
			'Equal Height': 'c-equal-height',
			'Align Leading Edges': 'c-align-leading-edges',
			'Align Top Edges': 'c-align-top-edges',
			'Align Trailing Edges': 'c-align-traling-edges',
			'Align Botton Edges': 'c-align-bottom-edges',
			'Horizontally Align': 'c-horizontally-align',
			'Vertically Align': 'c-vertically-align',
		}
	}
};